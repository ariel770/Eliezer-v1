var express = require('express');
var route = express.Router();
var Reports = require("../models/reports.js");
var Statistic = require("../models/statistic.js");
var Agents = require("../models/agents.js");
const middlewhereObj = require('../middlewhere/index.js');

var currentStatistic = {};




//SHOW ALL THE AGENTS (NEED TO SPECIFIC TO THE AGENT )
route.get("/", middlewhereObj.isLoggedIn, function (req, res) {
    Agents.find({}, function (err, agents) {
        console.log("create :");

        if (err) {
            console.log(err)
        } else {
            res.render("agents/list.ejs", { agents: agents });
        }
    })

})

//CREATE NEW AGENT 
route.get("/new", function (req, res) {
    res.render("agents/newAgent.ejs")
    //REDIRECT TO REGISTER PAGE (IN INDEX )
});



//SHOW A SPECIFIC AGENT (WITH A  STATISTIC)
route.get("/:id", function (req, res) {
    Agents.findById(req.params.id, function (err, agent) {
        if (err) {

        } else {
            Statistic.find({ "agent.id": req.params.id }, function (err, statistics) {
                if (err) {
                    console.log(err)
                } else {

                    Reports.find({ "agent.id": req.params.id }, function (err, report) {
                        if (err) {
                            res.redirect("back")
                        } else {
                            //======================================================= 
                            //ADD THE FUNCTIONS THAT CHECK IF IS OK OR NOT , RASHI !!
                            //======================================================= 
                            for (i = 0; i < report.length; i++) {
                                for (b = 0; b < statistics.length; b++) {

                                    if (statistics[b].meetings = report[i].meeting) {
                                        //    suMeetings = statistics[b].meetings - report[i].meeting
                                        //     currentStatistic.meetings = suMeetings;
                                    } else {
                                        // console.log("IS inCORRECT")

                                    }
                                }
                            }
                            res.render("agents/show.ejs", { agent: agent, statistics: statistics, report: report, currentStatistic: currentStatistic })
                        }
                    })
                }
            })
        }
    })

})

//EDIT SPECIFIC AGENT 
route.get("/:id/edit", function (req, res) {

    Agents.findById(req.params.id, function (err, agent) {
        if (err) {
            console.log(err)
        } else {
            // Statistic.find({ "agent.id": req.params.id }, function (err, statistics) {
            //     if (err) {
            //         console.log(err)
            //     } else {
            // res.render("agents/editAgent.ejs", { agent: agent, statistics: statistics })
            res.render("agents/editAgent.ejs", { agent: agent })
            //     }
            // })
        }
    })


});

//INSERT THE FIX AGENTS TO THE DB
route.put("/:id", function (req, res) {
    Agents.findByIdAndUpdate(req.params.id, req.body.agent, function (err, agent) {
        console.log("update :");

        if (err) {
            console.log(err)
        } else {

            res.redirect("/agent/" + req.params.id)
        }
    })

});


//SET STATISTICS
route.get("/:id/setgoals", function (req, res) {

    Agents.findById(req.params.id, function (err, agents) {
        if (err) {
            res.redirect("back");
        } else {
            res.render("agents/setgoals.ejs", { agents, agents })
        }
    })



})

//ADD THE STATISTICS TO DB

route.post("/:id/setgoals", function (req, res) {

    Agents.findById(req.params.id, function (err, agents) {
        if (err) {
            res.redirect("back");
        } else {
            //=============================
            //NEED TO ADD THE FUNCTIONS !!! 
            //=============================
            var goal = req.body.money;
            var avg = 20000;
            var qtyOfMeeting = goal / avg;

            var statistic = {
                agent: {
                    username: agents.username,
                    id: agents.id,
                },
                meetings: qtyOfMeeting,
                approachesToClosingDeal: qtyOfMeeting,
                interestedWhoeBuying: qtyOfMeeting,
                propertiesShowUp: qtyOfMeeting,
                commissionFee: qtyOfMeeting,
                averageTransaction: qtyOfMeeting,
                salesExclusivity: avg,
                meetingsExclusivity: goal
            }
            Statistic.create(statistic, function (err, statistics) {
                if (err) {
                    console.log(err)
                } else {

                    res.redirect("/agent/" + req.params.id)
                }
            })

        }
    })
})

//DELETE AGENT
route.delete("/:id", function (req, res) {
    Agents.findByIdAndRemove(req.params.id, function (err, agent) {
        console.log("delete :");

        if (err) {
            res.redirect("/agent");
        } else {
            res.redirect("/agent");
        }
    })
})
module.exports = route;