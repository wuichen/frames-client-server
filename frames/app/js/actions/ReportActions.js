var Reflux = require('reflux');
var request = require('superagent');
var ReportActions = Reflux.createActions({
    // Child actions 'completed' and 'failed' are called by resolution of listenAndPromise
    'loadReport': {
        children: ['completed', 'failed']
    },
    'switchExpense': {},
    'radioSelect': {},
    'checkboxSelect': {},
    'submitReport': {},
    'nextImage': {},
    'selectImage': {},
    'previousImage': {},
    'checkLineValid':{},
    'checkAllComplete':{},
    'radioTextEdit':{},
    'saveTextEdit':{},
    'postReport': {
        children: ['completed', 'failed']
    },
    'loadLocalStorage': {
        children: ['completed', 'failed']
    },
    'updateMessage':{},
    'checkNetwork': {
        children: ['completed', 'failed']
    }
});
// ReportActions.postReport.listen(function(data){
//     var url = 'http://localhost:8080/next';
//     var promise = new Promise(function(resolve, reject) {
//         var request = $.ajax({
//           url: "http://localhost:8080/post",
//           method: "POST",
//           data: { data : data }
//         });
//         request.done(function( msg ) {
//             console.log(msg);
//             resolve(msg);
//         });
//         request.fail(function( jqXHR, textStatus ) {
//             console.log(textStatus);
//             reject();
//         });
//     }).then(ReportActions.postReport.completed).catch(ReportActions.postReport.failed);
//     return promise;

// })


// ReportActions.loadReport.listen(function(count) {
//     return new Promise(function(resolve, reject) {
//         console.log("init promise")
//         var request = $.ajax({
//           url: "http://localhost:8080/next",
//           method: "GET",
//           data: { count : count }
//         });
//         request.done(function(res){
//             resolve(res);
//         });
//         request.fail(function(jqXHR, textStatus){
//             reject(Error(textStatus));
//         })

//     }).then(ReportActions.loadReport.completed).catch(ReportActions.loadReport.failed);
// })

// ReportActions.loadReport.listen(function(count) {
//     var promise = $.ajax({
//         url: "http://localhost:8080/next",
//         method: "GET",
//         data: { count : count }
//     });

//     promise.then(ReportActions.loadReport.completed,ReportActions.loadReport.failed);
// })

//ReportActions.loadReport().catch(function() { /* prevents "Uncaught (in promise) error */});

ReportActions.checkNetwork.listenAndPromise(function() {
    return Promise.resolve($.ajax({
        type: 'GET',
        url: 'https://swb-demo.herokuapp.com/ping'
    }));
})

ReportActions.loadLocalStorage.listenAndPromise(function() {
    var localStorageData = JSON.parse(localStorage.getItem('reports'));

    return Promise.resolve(localStorageData);

})
ReportActions.loadReport.listenAndPromise(function(count) {
    return Promise.resolve($.ajax({
        type: 'GET',
        data: {count: count},
        url: 'https://swb-demo.herokuapp.com/next'
    }));
})

ReportActions.postReport.listenAndPromise(function(data) {
    return Promise.resolve($.ajax({
        type: 'POST',
        data: {data: data},
        url: 'https://swb-demo.herokuapp.com/post'
    }));
})

module.exports = ReportActions;
