var express = require('express');
var route = express.Router();
var Reports = require("../models/reports.js");
const Agents = require('../models/agents.js');
const middlewhereObj = require('../middlewhere/index.js');
const reports = require('../models/reports.js');
const { db } = require('../models/reports.js');

route.get("/agent/:id/report", middlewhereObj.isLoggedIn, function (req, res) {

    Agents.findById(req.params.id, function (err, agents) {
        if (err) {
            res.redirect("back")
        } else {
            var oop = {
                summettings: [], sumstickerFlyers: [], sumlearninGandRenewal: []
                , sumactualTransactions: [], sumrentalTours: [], sumcollaborations: [],
                sumconversationsWithPreviousClients: [], sumpricesOffer: []
            }
            Reports.find({ "agent.id": req.params.id }, function (err, report) {


                for (i = 1; i < report.length; i++) {
                    oop.summettings[i] = report[i].meeting;
                    oop.sumstickerFlyers[i] = report[i].stickerFlyers;
                    oop.sumlearninGandRenewal[i] = report[i].learninGandRenewal;
                    oop.sumactualTransactions[i] = report[i].actualTransactions;
                    oop.sumrentalTours[i] = report[i].rentalTours;
                    oop.sumcollaborations[i] = report[i].collaborations;
                    oop.sumconversationsWithPreviousClients[i] = report[i].conversationsWithPreviousClients;
                    oop.sumpricesOffer[i] = report[i].pricesOffer;
                }
                if (err) {
                    res.redirect("back");
                } else {
                    res.render("report/list.ejs", { report: report, agents: agents, oop: oop })
                }
            })
        }
    })

})
route.get("/agent/:id/report/monthlyreports", function (req, res) {  


    Reports.aggregate([
        //  IS WORK WITH AGENT BUT NOT BY DATE(MONTH) ============
    
        // {
        //     $group: {
        //         _id: { $month: "$date" },
        //         numberofbookings: { $sum: '$meeting' }
        //     }
        // }

        // {
        //     $group: {
        //         // username: '$agent.username',
        //         _id: { $substr: ['$date', 5, 2] },
        //         summettings: { $sum: '$meeting' }
        //     }
        // }
        {
            $group: {
                _id:{ $month: "$date"},
                count: {
                    $sum: '$meeting'
                }
            }
        }
    ], function (err, result) {

        console.log(result)
        console.log("succsess")
        res.redirect("back");
    })

});

//CREATE NEW REPORT 
route.get("/agent/:id/report/new", middlewhereObj.isUser, function (req, res) {

    Agents.findById(req.params.id, function (err, agents) {


        res.render("report/newReport.ejs", { agents: agents })
    })

});




//INSERT TO DATABASE AND REDIRECT TO THE REPORT PAGE FORM 
route.post("/agent/:id/report", middlewhereObj.isUser, function (req, res) {
    Agents.findById(req.params.id, function (err, agents) {
        if (err) {

        } else {
            var newReport = {
                agent: {
                    id: agents.id,
                    username: agents.username
                },
                date: new Date(),
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
                    res.redirect("/agent/" + agents.id + "/report/new");
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

module.exports = route;