var express = require('express');
var route = express.Router();
var Reports = require("../models/reports.js");
const Agents = require('../models/agents.js');
const middlewhereObj = require('../middlewhere/index.js');

route.get("/agent/:id/report",  function (req, res) {
    
    console.log(req.params.id)
    Agents.findById(req.params.id, function (err, agents) {
        if (err) {
            res.redirect("back")
        } else {
            Reports.find({ "agent.id": req.params.id }, function (err, report) {
                if (err) {
                    res.redirect("back");
                } else {
                   
                    res.render("report/list.ejs", { report: report, agents: agents });
                }
            })
        }
    })



    // Reports.find({}, function (err, report) {
    //     if (err) {
    //         console.log(err)
    //     } else {
    //         Agents.findById(req.user, function (err, agents) {
    //             res.render("report/list.ejs", { report: report, agents: agents });
    //         })
    //     }
    // })

})

//CREATE NEW REPORT 
route.get("/agent/:id/report/new", function (req, res) {

    Agents.findById(req.params.id, function (err, agents) {


        res.render("report/newReport.ejs", { agents: agents })
    })

});




//INSERT TO DATABASE AND REDIRECT TO THE REPORT PAGE FORM 
route.post("/agent/:id/report", function (req, res) {
    Agents.findById(req.params.id, function (err, agents) {
        if (err) {

        } else {
            var newReport = {
                agent: {
                    id: agents.id,
                    username: agents.username
                },
                tours: req.body.tours,
                meeting: req.body.meeting
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

route.get("/agent/:id/report/:report_id", function (req, res) {


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
route.get("/agent/:id/report/:report_id/edit", function (req, res) {
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
route.post("/agent/:id/report/:report_id", function (req, res) {
    console.log(req.params.id)
    Reports.findByIdAndUpdate(req.params.id, req.body.report, function (err, report) {
        if (err) {
            console.log(err)
        } else {
            res.redirect("/agent/" + req.params.id + "/report/" + req.params.report_id)
        }
    })

});

module.exports = route;