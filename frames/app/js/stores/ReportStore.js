var Reflux = require('reflux');
var ReportActions = require('../actions/ReportActions');

// testing dummy data when no networks.
var APISample = require('../utils/APISample');

var ReportStore = Reflux.createStore({
    listenables: [ReportActions],

    data:{
        selectedIndex: null,
        isConnectedToInternet: null,
        queue: [],
        isAllComplete: false,
        samplePictures: ['https://upload.wikimedia.org/wikipedia/commons/0/0b/ReceiptSwiss.jpg', 'http://s3-media4.fl.yelpcdn.com/bphoto/eTxwKJdgj_jLmMhIqItO4A/o.jpg', 'http://s3-media2.fl.yelpcdn.com/bphoto/XtRAlFu9Asiez68rTAi_nQ/348s.jpg'],
        samplePicturesIndex: 0,
        pendingReports: [],
        message:{
            show: false,
            message: "",
            error: false
        }
    },

    getInitialState : function() {
        return this.data;
    },

    onSwitchExpense: function(selectedIndex) {
        if(this.data.selectedIndex === selectedIndex){
            this.data.selectedIndex = null;
            this.data.samplePicturesIndex = null;
        }else{
            this.data.selectedIndex = selectedIndex;
            this.data.samplePicturesIndex = 0;
        }
        this.trigger(this.data);
    },

    onCheckLineValid: function () {
        var allValid = 'greenCheck';
        var answeredQustions = 0;
        var lineItem = this.data.current.LineItem[this.data.selectedIndex];
        for (var j = lineItem.Questions.length - 1; j >= 0; j--) {
            if(typeof lineItem.Questions[j].isValid !== 'undefined'){
                if (lineItem.Questions[j].isValid === 'redCross' && allValid != 'yellowWarning') {
                    allValid = lineItem.Questions[j].isValid;
                }else if (lineItem.Questions[j].isValid === 'yellowWarning') {
                    allValid = lineItem.Questions[j].isValid;
                }
                answeredQustions++;
            }
        }

        if (answeredQustions === lineItem.Questions.length) {
            lineItem.isComplete = true;
        }

        if(lineItem.isComplete) {
            if (allValid === 'greenCheck'){
                lineItem.isAllValid = 'greenCheck';
            } else if (allValid === 'redCross') {
                lineItem.isAllValid = 'redCross';
            } else if (allValid === 'yellowWarning') {
                lineItem.isAllValid = 'yellowWarning';
            }
        } else {
            lineItem.isAllValid = 'white';
        }

        if (lineItem.isAllInvalid) {
            lineItem.isAllValid = 'redCross';
        }
        ReportActions.checkAllComplete();
    },

    onCheckAllComplete : function() {

        var completedLineItem = 0;
        for (var i = this.data.current.LineItem.length - 1; i >= 0; i--) {
            if (this.data.current.LineItem[i].isComplete) {
                completedLineItem++
            }
        }

        if (completedLineItem === this.data.current.LineItem.length) {
            this.data.current.isAllComplete = true;
            this.updateMessage('All expenses has been reviewed',true,false);
        }else{
            this.data.current.isAllComplete = false;
        }
        this.trigger(this.data);
        this.updateLocalStorage();
    },

    onCheckboxSelect: function (questionIndex, answer, answerIndex){
        var selectedQuestion = this.data.current.LineItem[this.data.selectedIndex].Questions[questionIndex];
        selectedQuestion.possibleanswers[answerIndex].checked = !selectedQuestion.possibleanswers[answerIndex].checked;
        if(selectedQuestion.possibleanswers[answerIndex].checked){
            selectedQuestion.resultIds.push(answer.answerId)
        }else{

            var removeIndex = selectedQuestion.resultIds.indexOf(answer.answerId);
            selectedQuestion.resultIds.splice(removeIndex,1);

        }

        if(selectedQuestion.mustSelect.length > 0){
            var isValid = 'greenCheck';
            for(var i=0; i<=selectedQuestion.mustSelect.length-1; i++){
                if(selectedQuestion.resultIds.indexOf(selectedQuestion.mustSelect[i]) < 0){
                    isValid = 'redCross';
                }
            }
            selectedQuestion.isValid = isValid;
        }else{
            selectedQuestion.isValid = 'greenCheck';
        }

        ReportActions.checkLineValid();
    },

    onRadioSelect: function(questionIndex, answer) {
        //var questionIndex = this.data.current.LineItem[this.data.selectedIndex].Questions.indexOf(question);
        var radioQuestion = this.data.current.LineItem[this.data.selectedIndex].Questions[questionIndex];
        radioQuestion.resultId = answer.answerId;

        if (answer.state === 'WARNING') {
            radioQuestion.isValid = 'yellowWarning';
        } else if (answer.state === 'PASS') {
            radioQuestion.isValid = 'greenCheck';
            if(this.data.current.LineItem[this.data.selectedIndex].LegibleReceiptRequired){
                if(radioQuestion.question === 'Receipt Eligibility'){
                    this.data.current.LineItem[this.data.selectedIndex].isAllInvalid = false;
                    this.data.current.LineItem[this.data.selectedIndex].isComplete = false;
                }
            }
        } else {
            radioQuestion.isValid = 'redCross';
            if(this.data.current.LineItem[this.data.selectedIndex].LegibleReceiptRequired){
                if(radioQuestion.question === 'Receipt Eligibility'){
                    this.data.current.LineItem[this.data.selectedIndex].isAllInvalid = true;
                    this.data.current.LineItem[this.data.selectedIndex].isComplete = true;
                }
            }
        }
        ReportActions.checkLineValid();
    },

    onRadioTextEdit : function(questionIndex, answerIndex, value) {
       this.data.current.LineItem[this.data.selectedIndex].Questions[questionIndex].possibleanswers[answerIndex].customFieldAnswer = value;
        this.trigger(this.data);
        this.updateLocalStorage();
    },

    onSaveTextEdit : function(questionIndex, value) {
        if(this.data.current.LineItem[this.data.selectedIndex].Questions[questionIndex].mustAnswer){
            if(value.length > 0){
                this.data.current.LineItem[this.data.selectedIndex].Questions[questionIndex].isValid = 'greenCheck';
            }else{
                this.data.current.LineItem[this.data.selectedIndex].Questions[questionIndex].isValid = 'redCross';
            }
        }else{
            this.data.current.LineItem[this.data.selectedIndex].Questions[questionIndex].isValid = 'greenCheck';
        }
        this.data.current.LineItem[this.data.selectedIndex].Questions[questionIndex].answer = value;
        ReportActions.checkLineValid();
    },

    onSubmitReport: function() {

        // push current reports audit results into auditresults array.
        var auditResult = {}
        auditResult.Header = this.data.current.Header;
        auditResult.LineItem = this.data.current.LineItem;
        this.data.current.AuditResults.push(auditResult);

        // push to report to the queue of reports that needs to be submited
        this.data.pendingReports.push(this.data.current);

        // push the next report to current report
        this.pushNextReportToCurrentFromQueue();

        // set the selected index to 0 for the next report
        this.data.selectedIndex = null;

        // update the view and localstorage
        this.updateLocalStorage();
        this.trigger(this.data);
        console.log('remaining reports : ',this.data.queue.length);

        if(this.data.queue.length < 5) {
            console.log("remaining reports less than 5, fetch another 5");
            ReportActions.loadReport(5).catch(function(){});
        }
    },

    pushNextReportToCurrentFromQueue: function() {
        this.data.current = this.data.queue[0];
        this.data.queue.splice(0, 1);

        this.updateLocalStorage();

        this.trigger(this.data);
    },

    onPostReportCompleted: function(res){
        // this.updateMessage('You have submited the report successfully',true,false)

        // console.log(this.data.pendingReports);
        this.data.pendingReports.splice(0,1);
        this.trigger(this.data);
        this.updateLocalStorage();
        console.log('report posted!');
    },

    onPostReportFailed: function(er) {
        // this.data.pendingReports.push(this.data.current);
        // this.updateMessage('Failed posting, will try to post again automatically when theres internet connection',true,true);
        console.log(er);
        // this.updateLocalStorage();
        // console.log('failed man!!',this.data.pendingReports);
    },

    onNextImage: function() {
        var maxIndex = this.data.current.LineItem[this.data.selectedIndex].LinePictures.length - 1;
        if (this.data.samplePicturesIndex < maxIndex) {
            this.data.samplePicturesIndex++;
        }
        this.trigger(this.data);
    },

    onSelectImage: function(index) {
        this.data.samplePicturesIndex = index;
        this.trigger(this.data);
    },

    onPreviousImage: function() {
        if (this.data.samplePicturesIndex > 0) {
            this.data.samplePicturesIndex--;
        }
        this.trigger(this.data);
    },
    // Clear out the current report and any errors while we load the next review
    // onLoadReport () {
    //   data.current = null;
    //   this.trigger(data);
    // },

    // Called from ReportActions.loadReport.listenAndPromise
    onLoadReportCompleted: function(res) {
        var displayString = 'loaded ' + res.length + ' reports to the system';
        this.updateMessage('loaded ' + res.length + ' reports to the system',true,false)
        // save the first report in the array to current. the rest to queue
        // data.current = JSON.parse(JSON.stringify(res[0]));

        for (var i = 0; i <= res.length - 1; i++) {

            this.data.queue.push(res[i]);
        }
        if (!this.data.current) {
            this.pushNextReportToCurrentFromQueue();
        }

        //this.data.loadError = res.error;

        // this.addRadioQuestions();


        this.updateLocalStorage();
        this.trigger(this.data);
        console.log(displayString, res);
    },

    updateLocalStorage: function() {
        if(typeof localStorage === 'undefined'){
        }else{
            localStorage.setItem('reports', JSON.stringify(this.data));
        }
    },
    // Called from ReportActions.loadReport.listenAndPromise
    onLoadReportFailed: function() {
        // this.updateMessage('loaded report failed',true,true);

        console.log("Cant connect to internet. using local fake data.");
        this.data.queue.push(JSON.parse(JSON.stringify(APISample)));
        if(!this.data.current){
            this.pushNextReportToCurrentFromQueue();
        }
        this.trigger(this.data);
    },

    onLoadLocalStorageCompleted: function(res) {
        if (res) {
            this.data = res;
            console.log('loaded data from localStorage',res);
            this.trigger(this.data);
            // this.updateMessage('loaded data from localStorage',true,false);
        }

        if (!this.data.queue) {
            this.data.queue = [];
        }
        if (this.data.queue.length < 30) {
            ReportActions.loadReport(1).catch(function(){}).then(function(){
                setTimeout(function(){
                    ReportActions.loadReport(5).catch(function(){});
                },5000)
            });
        }
    },

    updateMessage: function(message,show,error) {
        var that = this;
        this.data.message.message = message;
        this.data.message.show = show;
        this.data.message.error = error;
        this.trigger(this.data);
        setTimeout(function(){
            that.data.message.show = false;
            that.trigger(this.data);
        },3000);
    },


    onCheckNetworkCompleted: function(res) {
        // if(this.data.hasConnection == false){
        //     this.updateMessage('Connected to internet', true, false);
        //     this.data.hasConnection = true;
        //     this.trigger(this.data);
        // }
        this.data.isConnectedToInternet = true;
        this.trigger(this.data);
        // if(this.data.pendingReports.length > 0){
        //     ReportActions.postReport(this.data.pendingReports[0]).catch(function(){})
        // }
    },

    onCheckNetworkFailed : function() {
        this.data.isConnectedToInternet = false;
        this.trigger(this.data);
        // if(this.data.hasConnection == true){
        //     this.data.hasConnection = false;
        //     this.trigger(this.data);
        //     this.updateMessage('No internet access', true, true);
        // }
    }
});

module.exports = ReportStore;
