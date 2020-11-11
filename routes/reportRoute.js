var express = require('express');
var route = express.Router();
var Reports = require("../models/reports.js");
var Statistic = require("../models/statistic.js");
const Agents = require('../models/agents.js');
const middlewhereObj = require('../middlewhere/index.js');
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



route.get("/agent/:id/report/monthlyreports", function (req, res) {
    Reports.aggregate([{
        $sort: { date: 1 }
    }, {
        $match: {
            'agent.id': ObjectId(req.params.id)
        }
    }, {
        $group: {

            _id: {
                year: { '$year': '$date' },
                month: { '$month': '$date' }
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
    }
    ], function (err, report) {
        if (err) {
            console.log("error  : " + err)
            res.redirect("back")
        } else {
            // I do not need that object  I can send just object from report  but ... i just do it 
            var analisys = {
                year: [],
                month: [],
                monthlyNeedMeetings: Number,
                monthlyNeedstickerFlyers: Number,
                monthlyNeedlearninGandRenewal: Number,
                monthlyNeednegotiationsInTheProcess: Number,
                monthlyNeedactualTransactions: Number,
                monthlyNeedrentalTours: Number,
                monthlyNeedcollaborations: Number,
                monthlyNeedconversationsWithPreviousClients: Number,
                monthlyNeedpricesOffer: Number,
                currentMonthTotalDays: [],
                sumMonthlyLearninGandRenewal: [],
                sumMonthlyMeetings: [],
                sumMonthlyStickerFlyers: [],
                sumMonthlyNegotiationsInTheProcess: [],
                sumMonthlyActualTransactions: [],
                sumMonthlyRentalTours: [],
                sumMonthlyCollaborations: [],
                sumMonthlyConversationsWithPreviousClients: [],
                sumMonthlyPricesOffer: [],
                currentDayFromMonth: []
            };
            Statistic.find({ "agent.id": req.params.id }, function (err, statistic) {
                if (err) {
                    res.redirect("back")
                } else {
                    for (i = 0; i < statistic.length; i++) {
                        analisys.monthlyNeedMeetings = statistic[i].meeting
                        analisys.monthlyNeedstickerFlyers = statistic[i].stickerFlyers
                        analisys.monthlyNeedlearninGandRenewal = statistic[i].learninGandRenewal
                        analisys.monthlyNeednegotiationsInTheProcess = statistic[i].negotiationsInTheProcess
                        analisys.monthlyNeedactualTransactions = statistic[i].actualTransactions
                        analisys.monthlyNeedrentalTours = statistic[i].rentalTours
                        analisys.monthlyNeedcollaborations = statistic[i].collaborations
                        analisys.monthlyNeedconversationsWithPreviousClients = statistic[i].conversationsWithPreviousClients
                        analisys.monthlyNeedpricesOffer = statistic[i].pricesOffer
                    }

                    for (i = 0; i < report.length; i++) {
                        analisys.year.push(report[i]._id.year);
                        analisys.month.push(report[i]._id.month);
                        analisys.sumMonthlyMeetings.push(report[i].countmeeting);
                        analisys.sumMonthlyStickerFlyers.push(report[i].countstickerflyers);
                        analisys.sumMonthlyLearninGandRenewal.push(report[i].countlearninGandRenewal);
                        analisys.sumMonthlyNegotiationsInTheProcess.push(report[i].countnegotiationsInTheProcess);
                        analisys.sumMonthlyActualTransactions.push(report[i].countactualTransactions);
                        analisys.sumMonthlyRentalTours.push(report[i].countrentalTours);
                        analisys.sumMonthlyCollaborations.push(report[i].countcollaborations);
                        analisys.sumMonthlyConversationsWithPreviousClients.push(report[i].countconversationsWithPreviousClients);
                        analisys.sumMonthlyPricesOffer.push(report[i].countpricesOffer);
                        analisys.currentMonthTotalDays.push(daysInMonth(analisys.month[i], analisys.year[i]))

                        if (new Date().getMonth() + 1 == report[i]._id.month) {
                            analisys.currentDayFromMonth.push(new Date().getDate())
                        } else {
                            analisys.currentDayFromMonth.push(daysInMonth(analisys.month[i], analisys.year[i]))
                        }
                    }

                    res.render("report/monthlyReports.ejs", { report: report, statistic: statistic, analisys: analisys })
                }
            })
        }
    })

});
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
            console.log("error  : " + err)
            res.redirect("back")
        } else {
            var monthlyGoals = {
                monthlyNeedMeetings: 0,
                monthlyNeedstickerFlyers: 0,
                monthlyNeedstickerFlyersa: 0,
                monthlyNeedlearninGandRenewal: 0,
                monthlyNeednegotiationsInTheProcess: 0,
                monthlyNeedactualTransactions: 0,
                monthlyNeedrentalTours: 0,
                monthlyNeedcollaborations: 0,
                monthlyNeedconversationsWithPreviousClients: 0,
                monthlyNeedpricesOffer: 0,
            }

            var analisys = {
                month: [],
                day: [],
                monthlyNeedMeetings: 0,
                monthlyNeedstickerFlyers: 0,
                monthlyNeedlearninGandRenewal: 0,
                monthlyNeednegotiationsInTheProcess: 0,
                monthlyNeedactualTransactions: 0,
                monthlyNeedrentalTours: 0,
                monthlyNeedcollaborations: 0,
                monthlyNeedconversationsWithPreviousClients: 0,
                monthlyNeedpricesOffer: 0,
                currentMonthTotalDays: [],
                sumMonthlyLearninGandRenewal: [],
                sumMonthlyMeetings: [],
                sumMonthlyStickerFlyers: [],
                sumMonthlyNegotiationsInTheProcess: [],
                sumMonthlyActualTransactions: [],
                sumMonthlyRentalTours: [],
                sumMonthlyCollaborations: [],
                sumMonthlyConversationsWithPreviousClients: [],
                sumMonthlyPricesOffer: [],
                currentDayFromMonth: [],
                sumDayMissung: []
            };
            Statistic.find({ "agent.id": req.params.id }, function (err, statistic) {
                if (err) {
                    res.redirect("back")
                } else {
                    var date = new Date()
                    for (i = 0; i < statistic.length; i++) {

                        var days = daysInMonth(date.getMonth() + 1, date.getFullYear())
                        analisys.monthlyNeedMeetings = statistic[i].meeting / days
                        analisys.monthlyNeedstickerFlyers = statistic[i].stickerFlyers / days
                        analisys.monthlyNeedlearninGandRenewal = statistic[i].learninGandRenewal / days
                        analisys.monthlyNeednegotiationsInTheProcess = statistic[i].negotiationsInTheProcess / days
                        analisys.monthlyNeedactualTransactions = statistic[i].actualTransactions / days
                        analisys.monthlyNeedrentalTours = statistic[i].rentalTours / days
                        analisys.monthlyNeedcollaborations = statistic[i].collaborations / days
                        analisys.monthlyNeedconversationsWithPreviousClients = statistic[i].conversationsWithPreviousClients / days
                        analisys.monthlyNeedpricesOffer = statistic[i].pricesOffer / days
                    }

                    for (i = 0; i < statistic.length; i++) {
                        monthlyGoals.monthlyNeedMeetings = statistic[i].meeting
                        monthlyGoals.monthlyNeedstickerFlyers = statistic[i].stickerFlyers
                        monthlyGoals.monthlyNeedlearninGandRenewal = statistic[i].learninGandRenewal
                        monthlyGoals.monthlyNeednegotiationsInTheProcess = statistic[i].negotiationsInTheProcess
                        monthlyGoals.monthlyNeedactualTransactions = statistic[i].actualTransactions
                        monthlyGoals.monthlyNeedrentalTours = statistic[i].rentalTours
                        monthlyGoals.monthlyNeedcollaborations = statistic[i].collaborations
                        monthlyGoals.monthlyNeedconversationsWithPreviousClients = statistic[i].conversationsWithPreviousClients
                        monthlyGoals.monthlyNeedpricesOffer = statistic[i].pricesOffer
                    }


                    for (i = 0; i < report.length; i++) {

                        analisys.month.push(report[i]._id.month);
                        analisys.day.push(report[i]._id.day);
                        analisys.sumMonthlyMeetings.push(report[i].countmeeting);
                        analisys.sumMonthlyStickerFlyers.push(report[i].countstickerflyers);
                        analisys.sumMonthlyLearninGandRenewal.push(report[i].countlearninGandRenewal);
                        analisys.sumMonthlyNegotiationsInTheProcess.push(report[i].countnegotiationsInTheProcess);
                        analisys.sumMonthlyActualTransactions.push(report[i].countactualTransactions);
                        analisys.sumMonthlyRentalTours.push(report[i].countrentalTours);
                        analisys.sumMonthlyCollaborations.push(report[i].countcollaborations);
                        analisys.sumMonthlyConversationsWithPreviousClients.push(report[i].countconversationsWithPreviousClients);
                        analisys.sumMonthlyPricesOffer.push(report[i].countpricesOffer);
                        analisys.currentMonthTotalDays.push(daysInMonth(date.getMonth() + 1, date.getFullYear()))

                        if (new Date().getMonth() + 1 == report[i]._id.month) {
                            analisys.currentDayFromMonth.push(new Date().getDate())
                        } else {
                            analisys.currentDayFromMonth.push(daysInMonth(date.getMonth() + 1, date.getFullYear()))
                        }

                    }

                    res.render("report/dayReport.ejs", { report: report, statistic: statistic, analisys: analisys, monthlyGoals: monthlyGoals })
                }
            })
        }

    })

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
route.post("/agent/:id/report" , middlewhereObj.isUser, function (req, res) {
    Agents.findById(req.params.id, function (err, agents) {
        if (err) {
            res.redirect("back")
        } else {
            Statistic.findOne({}, {}, { sort: { 'date': -1 } }, function (err, stas) {
                if (err || stas.length == 0) {
                    //   need work with that 
                    res.send("YOU NEED MAkE REPORT GOAL FIRST ")
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

                            agents.reports.push(report.id);
                            agents.save();
                            // res.redirect("/agent/" + agents.id + "/report/new");
                            console.log(report)
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