var express = require('express');
var route = express.Router();
var Reports = require("../models/reports.js");
var Statistic = require("../models/statistic.js");
const Agents = require('../models/agents.js');
const middlewhereObj = require('../middlewhere/index.js');
const statistic = require('../models/statistic.js');
var ObjectId = require('mongodb').ObjectID;

route.get("/agent/:id/report", middlewhereObj.isLoggedIn, function (req, res) {

    Agents.findById(req.params.id, function (err, agents) {
        if (err) {
            res.redirect("back")
        } else {
            Reports.find({ "agent.id": req.params.id }, function (err, report) {

                if (err) {
                    res.redirect("back");
                } else {
                    res.render("report/list.ejs", { report: report, agents: agents })

                }
            })
        }
    })

})



// route.get("/agent/:id/report/monthlyreports", function (req, res) {
//     Reports.aggregate([{
//         $sort: { date: 1 }
//     }, {
//         $match: {
//             'agent.id': ObjectId(req.params.id)
//         }
//     }, {
//         $group: {

//             _id: {
//                 year: { '$year': '$date' },
//                 month: { '$month': '$date' }
//             },
//             countmeeting: {
//                 $sum: '$meeting'
//             },
//             countstickerflyers: {
//                 $sum: '$stickerFlyers'
//             },
//             countlearninGandRenewal: {
//                 $sum: '$learninGandRenewal'
//             },
//             countnegotiationsInTheProcess: {
//                 $sum: '$negotiationsInTheProcess'
//             },
//             countactualTransactions: {
//                 $sum: '$actualTransactions'
//             },
//             countrentalTours: {
//                 $sum: '$rentalTours'
//             },
//             countcollaborations: {
//                 $sum: '$collaborations'
//             },
//             countconversationsWithPreviousClients: {
//                 $sum: '$conversationsWithPreviousClients'
//             },
//             countpricesOffer: {
//                 $sum: '$pricesOffer'
//             }
//         }
//     }
//     ], function (err, report) {
//         if (err) {
//             console.log("error  : " + err)
//             res.redirect("back")
//         } else {   // I do not need that object  I can send just object from report  but ... i just do it 
//             var analisys = {
//                 year: [],
//                 month: [],
//                 monthlyNeedMeetings: Number,
//                 monthlyNeedstickerFlyers: Number,
//                 monthlyNeedlearninGandRenewal: Number,
//                 monthlyNeednegotiationsInTheProcess: Number,
//                 monthlyNeedactualTransactions: Number,
//                 monthlyNeedrentalTours: Number,
//                 monthlyNeedcollaborations: Number,
//                 monthlyNeedconversationsWithPreviousClients: Number,
//                 monthlyNeedpricesOffer: Number,
//                 currentMonthTotalDays: [],
//                 sumMonthlyLearninGandRenewal: [],
//                 sumMonthlyMeetings: [],
//                 sumMonthlyStickerFlyers: [],
//                 sumMonthlyNegotiationsInTheProcess: [],
//                 sumMonthlyActualTransactions: [],
//                 sumMonthlyRentalTours: [],
//                 sumMonthlyCollaborations: [],
//                 sumMonthlyConversationsWithPreviousClients: [],
//                 sumMonthlyPricesOffer: [],
//                 currentDayFromMonth: []
//             };
//             Statistic.find({ "agent.id": req.params.id }, function (err, statistic) {
//                 if (err) {
//                     res.redirect("back")
//                 } else {
//                     for (i = 0; i < statistic.length; i++) {
//                         analisys.monthlyNeedMeetings = statistic[i].meeting
//                         analisys.monthlyNeedstickerFlyers = statistic[i].stickerFlyers
//                         analisys.monthlyNeedlearninGandRenewal = statistic[i].learninGandRenewal
//                         analisys.monthlyNeednegotiationsInTheProcess = statistic[i].negotiationsInTheProcess
//                         analisys.monthlyNeedactualTransactions = statistic[i].actualTransactions
//                         analisys.monthlyNeedrentalTours = statistic[i].rentalTours
//                         analisys.monthlyNeedcollaborations = statistic[i].collaborations
//                         analisys.monthlyNeedconversationsWithPreviousClients = statistic[i].conversationsWithPreviousClients
//                         analisys.monthlyNeedpricesOffer = statistic[i].pricesOffer
//                     }

//                     for (i = 0; i < report.length; i++) {
//                         analisys.year.push(report[i]._id.year);
//                         analisys.month.push(report[i]._id.month);
//                         analisys.sumMonthlyMeetings.push(report[i].countmeeting);
//                         analisys.sumMonthlyStickerFlyers.push(report[i].countstickerflyers);
//                         analisys.sumMonthlyLearninGandRenewal.push(report[i].countlearninGandRenewal);
//                         analisys.sumMonthlyNegotiationsInTheProcess.push(report[i].countnegotiationsInTheProcess);
//                         analisys.sumMonthlyActualTransactions.push(report[i].countactualTransactions);
//                         analisys.sumMonthlyRentalTours.push(report[i].countrentalTours);
//                         analisys.sumMonthlyCollaborations.push(report[i].countcollaborations);
//                         analisys.sumMonthlyConversationsWithPreviousClients.push(report[i].countconversationsWithPreviousClients);
//                         analisys.sumMonthlyPricesOffer.push(report[i].countpricesOffer);
//                         analisys.currentMonthTotalDays.push(daysInMonth(analisys.month[i], analisys.year[i]))

//                         if (new Date().getMonth() + 1 == report[i]._id.month) {
//                             analisys.currentDayFromMonth.push(new Date().getDate())
//                         } else {
//                             analisys.currentDayFromMonth.push(daysInMonth(analisys.month[i], analisys.year[i]))
//                         }
//                     }

//                     res.render("report/monthlyReports.ejs", { report: report, statistic: statistic, analisys: analisys })
//                 }
//             })

//         }
//     })

// });

route.get("/agent/:id/report/monthlyreportsA", function (req, res) {
    Reports.aggregate([ {
        $match: {
            'agent.id': ObjectId(req.params.id)
        }
    }, {
        $group: {

            _id: {
                year: { '$year': '$date' },
                month: { '$month': '$date' }
                // ,statistics:'$statistics.id'
            },
            countmeeting: {
                $sum: '$meeting'
            },
            countstickerflyers: {
                $sum: '$stickerFlyers'
            },
            countlearninGandRenewal: {
                $sum: '$learninGandRenewal'
            },
            countnegotiationsInTheProcess: {
                $sum: '$negotiationsInTheProcess'
            },
            countactualTransactions: {
                $sum: '$actualTransactions'
            },
            countrentalTours: {
                $sum: '$rentalTours'
            },
            countcollaborations: {
                $sum: '$collaborations'
            },
            countconversationsWithPreviousClients: {
                $sum: '$conversationsWithPreviousClients'
            },
            countpricesOffer: {
                $sum: '$pricesOffer'
            }
        }
    },{
        $sort: { '_id.month': -1 }
    },
    ], function (err, report) {
        if (err) {
            console.log("error  : " + err)
            res.redirect("back")
        } else {


            Statistic.aggregate([{
                $sort: { date: -1 }
            }, {
                $match: {
                    'agent.id': ObjectId(req.params.id)
                }
            },{
                  $group: {

                    _id: {
                        year: { '$year': '$date' },
                        month: { '$month': '$date' }
                    },
                    avgmeeting: {
                        $avg: '$meeting'
                    },
                    avgstickerflyers: {
                        $avg: '$stickerFlyers'
                    },
                    avglearninGandRenewal: {
                        $avg: '$learninGandRenewal'
                    },
                    avgnegotiationsInTheProcess: {
                        $avg: '$negotiationsInTheProcess'
                    },
                    avgactualTransactions: {
                        $avg: '$actualTransactions'
                    },
                    avgrentalTours: {
                        $avg: '$rentalTours'
                    },
                    avgcollaborations: {
                        $avg: '$collaborations'
                    },
                    avgconversationsWithPreviousClients: {
                        $avg: '$conversationsWithPreviousClients'
                    },
                    avgpricesOffer: {
                        $avg: '$pricesOffer'
                    }
                }
            },{
                $sort: { '_id.month': -1 }
            }



            ], function (err, statistics) {
              
                if (err || report.length == 0) {
                    // res.redirect("back")
                    res.render("report/monthlyReportsA.ejs", {
                        report: "", statistics: "",
                        daysInCurrentMonth: "", currentDayInMonth: ""
                    })
                } else {


                    var daysInCurrentMonth = []
                    var currentDayInMonth = []
                    for (i = 0; i < statistics.length; i++) {

                        daysInCurrentMonth.push(daysInMonth(statistics[i]._id.month, statistics[i]._id.year));

                        if (new Date().getMonth() + 1 == statistics[i]._id.month) {
                            currentDayInMonth.push(new Date().getDate())
                        } else {
                            currentDayInMonth.push(daysInMonth(statistics[i]._id.month, statistics[i]._id.year))
                        }
                    }
                    console.log("=======monthlyreportsA route ===============")
                    console.log("report")
                    console.log(report)
                    console.log("statistics")
                    console.log(statistics)
                    console.log("daysInCurrentMonth")
                    console.log(daysInCurrentMonth)
                    console.log("currentDayInMonth")
                    console.log(currentDayInMonth)

                    console.log("=======  /monthlyreportsA route/ ===============")
                    res.render("report/monthlyReportsA.ejs", {
                        report: report, statistics: statistics,
                        daysInCurrentMonth: daysInCurrentMonth, currentDayInMonth: currentDayInMonth
                    })
                }
            })



        }
    })

});


//  ALL HAPANIM !!!!! ON THE FACE !!!!!
route.get("/agent/:id/report/dayreport", function (req, res) {
    Reports.aggregate([
        {
            $match: {
                'agent.id': ObjectId(req.params.id)
            }
        }, {
            $group: {

                _id: {
                    month: { '$month': '$date' },
                    day: { '$dayOfMonth': '$date' },
                },
                countmeeting: {
                    $sum: '$meeting'
                },
                countstickerflyers: {
                    $sum: '$stickerFlyers'
                },
                countlearninGandRenewal: {
                    $sum: '$learninGandRenewal'
                },
                countnegotiationsInTheProcess: {
                    $sum: '$negotiationsInTheProcess'
                },
                countactualTransactions: {
                    $sum: '$actualTransactions'
                },
                countrentalTours: {
                    $sum: '$rentalTours'
                },
                countcollaborations: {
                    $sum: '$collaborations'
                },
                countconversationsWithPreviousClients: {
                    $sum: '$conversationsWithPreviousClients'
                },
                countpricesOffer: {
                    $sum: '$pricesOffer'
                }
            }

        },

        { $sort: { "_id": 1 } },
        { $limit: 7 }

    ], function (err, report) {
        if (err) {
        } else {
            Statistic.find({ "agent.id": req.params.id }).sort({ date: -1 }).limit(1).exec(function (err, statistic) {
                if (err) {
                    console.log("ERROR  " + err)
                    res.redirect("back")
                } else {
                    console.log(statistic)
                    console.log(report)
                    var daysInCurrentMonth = []
                    var currentDayInMonth = []
                    for (i = 0; i < report.length; i++) {

                        daysInCurrentMonth.push(daysInMonth(report[i]._id.month, new Date().getFullYear()))

                        if (new Date().getMonth() + 1 == report[i]._id.month) {
                            currentDayInMonth.push(new Date().getDate())
                        } else {
                            currentDayInMonth.push(daysInMonth(report[i]._id.month, new Date().getFullYear()))
                        }
                    }
                    res.render("report/dayReport.ejs", {
                        report: report, statistic: statistic,
                        daysInCurrentMonth: daysInCurrentMonth, currentDayInMonth: currentDayInMonth
                    })

                }
            })
        }
    });
});


//CREATE NEW REPORT 
route.get("/agent/:id/report/new", middlewhereObj.isUser, function (req, res) {
    Agents.findById(req.params.id, function (err, agents) {
        if (err) {
        } else {
            res.render("report/newReport.ejs", { agents: agents })
        }
    })

});




//INSERT TO DATABASE AND REDIRECT TO THE REPORT PAGE FORM 
route.post("/agent/:id/report", middlewhereObj.isUser, function (req, res) {
    Agents.findById(req.params.id, function (err, agents) {
        if (err) {
            res.redirect("back")
        } else {
            Statistic.findById(req.params.id,{sort: { 'date': -1 } }, function (err, stas) {
                if (err) {
                    res.render("report/monthlyReportsA.ejs", {
                        report: "", statistics: "",
                        daysInCurrentMonth: "", currentDayInMonth: ""
                    })
                } else {
              
                    var newReport = {
                        agent: {
                            id: agents.id,
                            username: agents.username
                        },
                        date: new Date(),
                        statistics: {
                            id: stas._id
                        },
                        meeting: req.body.meeting,
                        stickerFlyers: req.body.stickerFlyers,
                        learninGandRenewal: req.body.learninGandRenewal,
                        negotiationsInTheProcess: req.body.negotiationsInTheProcess,
                        actualTransactions: req.body.actualTransactions,
                        rentalTours: req.body.rentalTours,
                        collaborations: req.body.collaborations,
                        conversationsWithPreviousClients: req.body.conversationsWithPreviousClients,
                        pricesOffer: req.body.pricesOffer,
                        remarks: req.body.remarks
                    }

                    Reports.create(newReport, function (err, report) {
                    
                        if (err) {
                            console.log(err)
                        } else {
                            console.log("==============/agent/:id/report ===============")
                            console.log(report)
                            console.log("==============/agent/:id/report ===============")
                            agents.reports.push(report.id);
                            agents.save();
                            console.log("==============/agent/:id/report ===============")
                            console.log(agents)
                            console.log("==============/agent/:id/report ===============")

                            // res.redirect("/agent/" + agents.id + "/report/new");

                            res.redirect("back");

                        }
                    })
                }

            })

        }
    })




})
//SHOW SPECIFIC REPORTS TO A SPECIFIC AGENT
route.get("/agent/:id/report/:report_id", middlewhereObj.isLoggedIn, function (req, res) {
    Agents.findById(req.params.id, function (err, agents) {
        if (err) {
        } else {
            Reports.findById(req.params.report_id, function (err, report) {
                if (err) {
                    console.log(err)
                } else {

                    res.render("report/show.ejs", { report: report, agents: agents });
                }
            })
        }
    })
})

//EDIT SPECIFIC REPORT 
route.get("/agent/:id/report/:report_id/edit", middlewhereObj.isMannager, function (req, res) {
    Agents.findById(req.params.id, function (err, agents) {
        if (err) {
            console.log(err)
        } else {

            Reports.findById(req.params.report_id, function (err, report) {
                if (err) {
                    console.log(err)
                } else {
                    res.render("report/editReport.ejs", { agents: agents, report: report })
                }
            })

        }
    })


});

//INSERT THE FIX REPORT TO THE DB
route.post("/agent/:id/report/:report_id", middlewhereObj.isMannager, function (req, res) {


    Reports.findByIdAndUpdate(req.params.report_id, req.body.report, function (err, report) {

        if (err) {
            console.log(err)
        } else {
            res.redirect("/agent/" + req.params.id + "/report/" + req.params.report_id)
        }
    })

});

function daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
}


module.exports = route;