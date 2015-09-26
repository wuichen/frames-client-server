var should = require('should');
// not testing submit report yet.

describe('ReportStore', function () {
    describe('unit tests', function () {
        var ReportActions;
        var ReportStore;
        beforeEach(function() {
            ReportActions = require('../app/js/actions/ReportActions');
            ReportStore = require('../app/js/stores/ReportStore');
            ReportStore.data.selectedIndex = 0;
        });

        describe('should ensure the store instantiates correctly:', function() {
            it('the store should be an object', function() {
                ReportStore.should.be.an.object;
            });
            it('the data should be an object', function() {
                ReportStore.data.should.be.an.object;
            });

        });

        describe('submit report', function() {
            it('should push data to audit result', function() {
                ReportStore.data.current = {};
                ReportStore.data.current.AuditResults = [];
                ReportStore.data.current.Header = {};
                ReportStore.data.current.LineItem = {};
                ReportStore.data.pendingReports = [];
                ReportStore.data.queue = [{a:'a'},{a:'a'},{a:'a'},{a:'a'},{a:'a'},{a:'a'},{a:'a'}];
                var currentCompare = ReportStore.data.current;
                ReportStore.onSubmitReport();

                ReportStore.data.pendingReports[0].should.eql(currentCompare);
            });
            it('should push next report to queue', function() {
                ReportStore.data.current = {};
                ReportStore.data.queue = [{a:'a'},{b:'b'}];
                var queueLength = ReportStore.data.queue.length;
                var currentCompare = ReportStore.data.queue[0];
                ReportStore.pushNextReportToCurrentFromQueue();
                ReportStore.data.current.should.eql(currentCompare);
                var count = queueLength - ReportStore.data.queue.length;
                count.should.eql(1);

            });
            it('should pop the report from pendingQueue', function() {
                ReportStore.data.pendingReports = [{a:'a'},{b:'b'}];
                var queueLength = ReportStore.data.pendingReports.length;
                ReportStore.onPostReportCompleted({});
                var count = queueLength - ReportStore.data.pendingReports.length;

                count.should.eql(1);
            });

        });

        describe('should change selectedIndex', function() {
            it('data.selectedIndex should change to what the parameter passed in', function() {
                var selectedIndexTest = 1;
                ReportStore.onSwitchExpense(selectedIndexTest);
                ReportStore.data.selectedIndex.should.eql(selectedIndexTest);
            })
        });

        describe('Has all the questions in a line item been answered?', function() {
            beforeEach( function() {
                    ReportStore.data.current = {};
            });
            it('has not been fully answered', function() {
                ReportStore.data.current.LineItem = [{
                          Questions:[{
                              control: 'RADIO',
                              isValid: 'greenCheck'
                          },
                          {
                              control: "RADIO",
                          },
                          {
                              control: 'RADIO',
                              isValid: 'redCross'
                          },
                          {
                              control: 'CHECKBOX',
                              isValid: 'redCross'
                          }]
                }]
                ReportStore.onCheckLineValid();
                // should.not.exist(ReportStore.data.current.LineItem[0].isAllValid);
                ReportStore.data.current.LineItem[0].isAllValid.should.eql('white');
            });
            it('all valid answers with greenCheck', function() {
              ReportStore.data.current = {};
                ReportStore.data.current.LineItem = [{
                          Questions:[{
                              control: "RADIO",
                              isValid: 'greenCheck'
                          },
                          {
                              control: "RADIO",
                              isValid: 'greenCheck'
                          },
                          {
                              control: "RADIO",
                              isValid: 'greenCheck'
                          }]
                }]
                ReportStore.onCheckLineValid();
                ReportStore.data.current.LineItem[0].isAllValid.should.eql('greenCheck');
            });
            it('finished with some invalid answers', function() {
              ReportStore.data.current = {}
                ReportStore.data.current.LineItem = [{
                          Questions:[{
                              control: "RADIO",
                              isValid: 'greenCheck'
                          },
                          {
                              control: "RADIO",
                              isValid: 'redCross'
                          },
                          {
                              control: "RADIO",
                              isValid: 'redCross'
                          }]
                }]
                ReportStore.onCheckLineValid();
                ReportStore.data.current.LineItem[0].isAllValid.should.eql('redCross');
            })
            it('finished with some warning answers', function() {
              ReportStore.data.current = {}
                ReportStore.data.current.LineItem = [{
                          Questions:[{
                              control: "RADIO",
                              isValid: 'yellowWarning'
                          },
                          {
                              control: "RADIO",
                              isValid: 'redCross'
                          },
                          {
                              control: "RADIO",
                              isValid: 'redCross'
                          }]
                }]
                ReportStore.onCheckLineValid();
                ReportStore.data.current.LineItem[0].isAllValid.should.eql('yellowWarning');
            })
        });

        describe('Has all the questions been completed', function() {
            beforeEach( function() {
                ReportStore.data.current = {}
            });
            it('has been all completed', function() {
                ReportStore.data.current.LineItem = [{
                          Questions:[{
                              control: "CHECKBOX",
                              "resultIds": [],
                              "mustSelect": ["PMDT","VNDR"],
                              "possibleanswers": [{
                                "answerId": "PMDT",
                                "displayText": "Payment date is between 2015/2/15 - 2015/5/20"
                              },
                              {
                                "answerId": "AMTX",
                                "displayText": "Amount is 22.39 GBP"
                              },
                              {
                                "answerId": "VNDR",
                                "displayText": "Vendor is Dishoom"
                              },
                              {
                                "answerId": "EXTP",
                                "displayText": "Expense Type is Meals/Entertainment"
                              },{
                                "answerId": "PMMD",
                                "displayText": "Payment method is Corporate Card"
                              }]
                          }]
                }]
                var answer1 = {
                                "answerId": "PMDT",
                                "displayText": "Payment date is between 2015/2/15 - 2015/5/20"
                              }
                var answer2 = {
                                "answerId": "VNDR",
                                "displayText": "Vendor is Dishoom"
                              }
                ReportStore.onCheckboxSelect(0,answer1,0);
                ReportStore.onCheckboxSelect(0,answer2,2);
                ReportStore.data.current.LineItem[0].Questions[0].isValid.should.eql('greenCheck');

            })
            it('has not been all completed', function() {
                ReportStore.data.current.LineItem = [{
                          Questions:[{
                              control: "CHECKBOX",
                              "resultIds": [],
                              "mustSelect": ["PMDT","VNDR"],
                              "possibleanswers": [{
                                "answerId": "PMDT",
                                "displayText": "Payment date is between 2015/2/15 - 2015/5/20"
                              },
                              {
                                "answerId": "AMTX",
                                "displayText": "Amount is 22.39 GBP"
                              },
                              {
                                "answerId": "VNDR",
                                "displayText": "Vendor is Dishoom"
                              },
                              {
                                "answerId": "EXTP",
                                "displayText": "Expense Type is Meals/Entertainment"
                              },{
                                "answerId": "PMMD",
                                "displayText": "Payment method is Corporate Card"
                              }]
                          }]
                }]
                var answer1 = {
                                "answerId": "AMTX",
                                "displayText": "Payment date is between 2015/2/15 - 2015/5/20"
                              }
                var answer2 = {
                                "answerId": "VNDR",
                                "displayText": "Vendor is Dishoom"
                              }
                ReportStore.onCheckboxSelect(0,answer1,1);
                ReportStore.onCheckboxSelect(0,answer2,2);
                ReportStore.data.current.LineItem[0].Questions[0].isValid.should.eql('redCross');
            })

        })
        describe('text box validation', function() {
            it('should save text entry', function() {
                ReportStore.data.current.LineItem = [{
                          Questions:[{
                            "id": 190,
                            "question": "Why is this charge needed?",
                            "control": "FILD",
                            "mustAnswer": true
                          }]
                }]
                ReportStore.onSaveTextEdit(0,'hello world');
                ReportStore.data.current.LineItem[0].Questions[0].answer.should.eql('hello world');
            });

        });
        describe('the checkbox selection should check if the answers are validated', function() {
            beforeEach( function() {
                ReportStore.data.current = {}
            });
            it('all must answered questions has been answered', function() {
                ReportStore.data.current.LineItem = [
                {isComplete: true},{isComplete: true},{isComplete: true}]
                ReportStore.onCheckAllComplete();
                ReportStore.data.current.isAllComplete.should.eql(true);
            })
            it('all must answered questions has not been answered', function() {
                ReportStore.data.current.LineItem = [
                {isComplete: true},{isComplete: true},{isComplete: false}]
                ReportStore.onCheckAllComplete();
                ReportStore.data.current.isAllComplete.should.eql(false);
            })

        })

        describe('image selection', function() {
            beforeEach( function(){
                ReportStore.data.current.LineItem = [{
                    "LinePictures": [{"url":"https://upload.wikimedia.org/wikipedia/commons/0/0b/ReceiptSwiss.jpg"}, {"url":"http://s3-media4.fl.yelpcdn.com/bphoto/eTxwKJdgj_jLmMhIqItO4A/o.jpg"}, {"url":"http://s3-media2.fl.yelpcdn.com/bphoto/XtRAlFu9Asiez68rTAi_nQ/348s.jpg"}]
                }]
            });
            it('previous picture index + 1', function() {
                ReportStore.data.samplePicturesIndex = 1;
                ReportStore.onNextImage();
                ReportStore.data.samplePicturesIndex.should.eql(2);
            })
            it('previous picture index -1', function() {
                ReportStore.data.samplePicturesIndex = 1;
                ReportStore.onPreviousImage();
                ReportStore.data.samplePicturesIndex.should.eql(0);
            })
            it('picture index shouldnt reduce one', function() {
                ReportStore.data.samplePicturesIndex = 0;
                ReportStore.onPreviousImage();
                ReportStore.data.samplePicturesIndex.should.eql(0);
            })
            it('picture index shouldnt increase one', function() {
                ReportStore.data.samplePicturesIndex = 2;
                ReportStore.onNextImage();
                ReportStore.data.samplePicturesIndex.should.eql(2);
            })

        })
        describe('load Reports', function() {
            it('succcessfully load report should push all the reports to queue when the current is not null', function() {
                var res = [{a:'a'},{b:'b'},{c:'c'}];
                ReportStore.data.current = {d:'d'};
                ReportStore.data.queue = [];

                ReportStore.onLoadReportCompleted(res);
                for(var i=0; i<=res.length-1; i++){
                    ReportStore.data.queue[i].should.eql(res[i]);
                }

            })

            it('succcessfully load report should push n-1 reports to queue when the current is null', function() {
                var res = [{a:'a'},{b:'b'},{c:'c'}];
                ReportStore.data.current = null;
                ReportStore.data.queue = [];

                ReportStore.onLoadReportCompleted(res);
                ReportStore.data.current.should.eql(res[0]);
                for(var i=0; i<=ReportStore.data.queue.length-1;i++){
                    ReportStore.data.queue[i].should.eql(res[i+1]);
                }

            })
            it('successfully load report from localstorage when theres something in localstorage', function() {
                var res = {data:'a'}
                ReportStore.onLoadLocalStorageCompleted(res);
                ReportStore.data.should.eql(res);
            })
            it('successfully load report from localstorage when theres nothing in localstorage', function() {
                var res = null;
                ReportStore.data = {a:'a'};
                var tempData = ReportStore.data;
                ReportStore.onLoadLocalStorageCompleted(res);
                ReportStore.data.should.eql(tempData);
                ReportStore.data.should.not.eql(res);
            })

        })


        describe('the radio selection should check if the answer is valid or not', function() {
            beforeEach( function(){
                ReportStore.data.current = {};
                ReportStore.data.selectedIndex = 0;
            });

            it('should save radio text value', function () {
                ReportStore.data.current.LineItem = [
                  {Questions:[
                      {
                          "id": 74,
                          "question": "Does the Receipt Tax value cover the system calculated Tax value?",
                          "control": "RADIO",
                          "sequenceNumber": 13,
                          "questionLevel": "L",
                          "resultId": "YESX",
                          "possibleanswers": [
                          {
                            "answerId": "CUSTM",
                            "state": "PASS",
                            "severityLevel": 1,
                            "displayText": "YES"
                          }]
                        }
                      ]

                  }
                ]

                ReportStore.onRadioTextEdit(0,0,'hello world');
                ReportStore.data.current.LineItem[0].Questions[0].possibleanswers[0].customFieldAnswer.should.eql('hello world');
            })
            it('should be a valid radio selection', function(){
                ReportStore.data.current.LineItem = [
                  {Questions:[
                      {
                          "id": 74,
                          "question": "Does the Receipt Tax value cover the system calculated Tax value?",
                          "control": "RADIO",
                          "sequenceNumber": 13,
                          "questionLevel": "L",
                          "resultId": "YESX",
                          "possibleanswers": [{
                            "answerId": "NAXX",
                            "state": "PASS",
                            "severityLevel": 1,
                            "displayText": "Not Applicable"
                          },
                          {
                            "answerId": "NRVD",
                            "state": "PASS",
                            "severityLevel": 1,
                            "displayText": "Restaurant meal and the Tax amount is not displayed on the receipt"
                          },
                          {
                            "answerId": "NSVD",
                            "state": "FAIL",
                            "severityLevel": 1,
                            "displayText": "Supermarket receipt and the Tax amount is not displayed on the receipt"
                          },
                          {
                            "answerId": "NVAD",
                            "state": "PASS",
                            "severityLevel": 1,
                            "displayText": "Different Tax amount is displayed on the receipt"
                          },
                          {
                            "answerId": "YESX",
                            "state": "PASS",
                            "severityLevel": 1,
                            "displayText": "YES"
                          }]
                        }
                      ]

                  }
                ]
                var questionIndex = 0;
                var answer = {
                            "answerId": "NSVD",
                            "state": "PASS",
                            "severityLevel": 1,
                            "displayText": "Supermarket receipt and the Tax amount is not displayed on the receipt"
                }
                ReportStore.onRadioSelect(questionIndex,answer);
                ReportStore.data.current.LineItem[0].Questions[0].isValid.should.eql('greenCheck');
            })
            it('should should be a warning radio button', function(){
                ReportStore.data.current = {};
                ReportStore.data.current.LineItem = [
                  {"LegibleReceiptRequired" : true,
                    Questions:[
                      {
                          "id": 74,
                          "question": "Receipt Eligibility",
                          "control": "RADIO",
                          "sequenceNumber": 13,
                          "questionLevel": "L",
                          "resultId": "YESX",
                          "possibleanswers": [{
                            "answerId": "NAXX",
                            "state": "PASS",
                            "severityLevel": 1,
                            "displayText": "Not Applicable"
                          },
                          {
                            "answerId": "NRVD",
                            "state": "PASS",
                            "severityLevel": 1,
                            "displayText": "Restaurant meal and the Tax amount is not displayed on the receipt"
                          },
                          {
                            "answerId": "NSVD",
                            "state": "FAIL",
                            "severityLevel": 1,
                            "displayText": "Supermarket receipt and the Tax amount is not displayed on the receipt"
                          },
                          {
                            "answerId": "NVAD",
                            "state": "WARNING",
                            "severityLevel": 1,
                            "displayText": "Different Tax amount is displayed on the receipt"
                          },
                          {
                            "answerId": "YESX",
                            "state": "PASS",
                            "severityLevel": 1,
                            "displayText": "YES"
                          }]
                        }
                      ]

                  }
                ]
                var answer = {
                            "answerId": "NVAD",
                            "state": "WARNING",
                            "severityLevel": 1,
                            "displayText": "Different Tax amount is displayed on the receipt"
                          }
                ReportStore.onRadioSelect(0,answer);
                ReportStore.data.current.LineItem[0].Questions[0].isValid.should.eql('yellowWarning');

            })
            it('should disable all other questions', function(){
                ReportStore.data.current = {};
                ReportStore.data.current.LineItem = [
                  {"LegibleReceiptRequired" : true,
                    Questions:[
                      {
                          "id": 74,
                          "question": "Receipt Eligibility",
                          "control": "RADIO",
                          "sequenceNumber": 13,
                          "questionLevel": "L",
                          "resultId": "YESX",
                          "possibleanswers": [{
                            "answerId": "NAXX",
                            "state": "PASS",
                            "severityLevel": 1,
                            "displayText": "Not Applicable"
                          },
                          {
                            "answerId": "NRVD",
                            "state": "PASS",
                            "severityLevel": 1,
                            "displayText": "Restaurant meal and the Tax amount is not displayed on the receipt"
                          },
                          {
                            "answerId": "NSVD",
                            "state": "FAIL",
                            "severityLevel": 1,
                            "displayText": "Supermarket receipt and the Tax amount is not displayed on the receipt"
                          },
                          {
                            "answerId": "NVAD",
                            "state": "PASS",
                            "severityLevel": 1,
                            "displayText": "Different Tax amount is displayed on the receipt"
                          },
                          {
                            "answerId": "YESX",
                            "state": "PASS",
                            "severityLevel": 1,
                            "displayText": "YES"
                          }]
                        }
                      ]

                  }
                ]
                var answer = {
                            "answerId": "NSVD",
                            "state": "FAIL",
                            "severityLevel": 1,
                            "displayText": "Supermarket receipt and the Tax amount is not displayed on the receipt"
                }
                ReportStore.onRadioSelect(0,answer);
                ReportStore.data.current.LineItem[0].isAllInvalid.should.eql(true);
                ReportStore.data.current.LineItem[0].isComplete.should.eql(true);
            })
            it('should be an invalid radio selection', function() {
                ReportStore.data.current.LineItem = [
                  {Questions:[
                      {
                          "id": 74,
                          "question": "Does the Receipt Tax value cover the system calculated Tax value?",
                          "control": "RADIO",
                          "sequenceNumber": 13,
                          "questionLevel": "L",
                          "resultId": "YESX",
                          "possibleanswers": [{
                            "answerId": "NAXX",
                            "state": "PASS",
                            "severityLevel": 1,
                            "displayText": "Not Applicable"
                          },
                          {
                            "answerId": "NRVD",
                            "state": "PASS",
                            "severityLevel": 1,
                            "displayText": "Restaurant meal and the Tax amount is not displayed on the receipt"
                          },
                          {
                            "answerId": "NSVD",
                            "state": "FAIL",
                            "severityLevel": 1,
                            "displayText": "Supermarket receipt and the Tax amount is not displayed on the receipt"
                          },
                          {
                            "answerId": "NVAD",
                            "state": "PASS",
                            "severityLevel": 1,
                            "displayText": "Different Tax amount is displayed on the receipt"
                          },
                          {
                            "answerId": "YESX",
                            "state": "PASS",
                            "severityLevel": 1,
                            "displayText": "YES"
                          }]
                        }
                      ]

                  }
                ]
                var questionIndex = 0;
                var answer = {
                            "answerId": "NSVD",
                            "state": "FAIL",
                            "severityLevel": 1,
                            "displayText": "Supermarket receipt and the Tax amount is not displayed on the receipt"
                }
                ReportStore.onRadioSelect(questionIndex,answer);
                ReportStore.data.current.LineItem[0].Questions[0].isValid.should.eql('redCross');
            })

        })
    });
});