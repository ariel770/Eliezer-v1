var express = require('express');
var route = express.Router();
var Reports = require("../models/reports.js");
var Statistic = require("../models/statistic.js");
var Agents = require("../models/agents.js");
const middlewhereObj = require('../middlewhere/index.js');

var currentStatistic = {};



//SHOW ALL THE AGENTS (NEED TO SPECIFIC TO THE AGENT )
route.get("/", middlewhereObj.isMannager, function (req, res) {
    Agents.find({}, function (err, agents) {
        if (err) {
            console.log(err)
        } else {
            res.render("agents/list.ejs", { agents: agents });
        }
    })

})

//CREATE NEW AGENT 
route.get("/new", middlewhereObj.isMannager, function (req, res) {
    res.render("agents/newAgent.ejs")
    //REDIRECT TO REGISTER PAGE (IN INDEX )
});

//SHOW A SPECIFIC AGENT (WITH A  STATISTIC)
route.get("/:id", middlewhereObj.isMannager, function (req, res) {
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
                            res.render("agents/show.ejs", { agent: agent, statistics: statistics, report: "" })
                            //======================================================= 
                            //ADD THE FUNCTIONS THAT CHECK IF IS OK OR NOT , RASHI !!
                            //======================================================= 
                            // for (i = 0; i < report.length; i++) {
                            //     for (b = 0; b < statistics.length; b++) {
                            //         if (statistics[b].meetings = report[i].meeting) {
                            //             //    suMeetings = statistics[b].meetings - report[i].meeting
                            //             //     currentStatistic.meetings = suMeetings;
                            //         } else {
                            //         }
                            //     }
                            // }
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

            res.render("agents/editAgent.ejs", { agent: agent })

        }
    })


});

//INSERT THE FIX AGENTS TO THE DB
route.put("/:id", function (req, res) {
    Agents.findByIdAndUpdate(req.params.id, req.body.agent, function (err, agent) {
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
    var avg;
    var qtyOfMeeting;

    Agents.findById(req.params.id, function (err, agents) {
        if (err) {
            res.redirect("back");
        } else {
            //=============================
            //NEED TO FIX THE FUNCTIONS !!! 
            //=============================
            var goal = req.body.money;
            var marketingActivity;
            var meetings;
            var apartmentView;
            var qtyOfDeals;
            agents.status = req.body.status;
            agents.save();


            if (req.body.status == "comersial") {
                avg = 20000;

            } else {
                avg = 30000
            }
            //1 
            qtyOfDeals = goal / avg;//33.3333
            //2
            apartmentView = qtyOfDeals / 6;
            var c;
            c = qtyOfDeals * apartmentView;
            //3            
            meetings = apartmentView / 5;
            //4
            marketingActivity = meetings / 5;


            console.log("C :" + c)
            console.log("avg :" + avg)
            console.log("======================");
            console.log("goal :" + goal);
            console.log("======================");
            console.log("qtyOfDeals :" + qtyOfDeals);
            console.log("======================")
            console.log("apartmentView :" + apartmentView);
            console.log("======================");
            console.log("mettings :" + meetings);
            console.log("======================");
            console.log("marketingActivity :" + marketingActivity);
            console.log("======================");
            // callsToBuyers = marketingActivity * 5;
            // mettingToBuyers = (callsToBuyers * 3) + (callsToSalles * 2);
            // mettingToSalles = (callsToBuyers * 3) + (callsToSalles * 2);
            // deals = meetingsTosalles * 5 + mettingToBuyers * 10;
            // delas = callsToBuyers + mettingToBuyers + mettingToSalles;

            var statistic = {
                agent: {
                    username: agents.username,
                    id: agents.id,
                    status: req.body.status
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
                    Agents.findByIdAndUpdate(req.params.id, statistic.agent, function (err, agents) {
                        if (err) {
                            res.redirect("back")
                        } else {

                            agents.statistic.push(statistics.id)

                            res.redirect("/agent/" + req.params.id)

                        }
                    })

                }
            })

        }
    })
})


//GET REPORTS BETWEEN 2 DAYS
route.post("/getListReports/:id", function (req, res) {

    Reports.find({ "agent.id": req.params.id }, function (err, reports) {

        if (err) {
            res.redirect("back")
        } else {


            var date1 = new Date(req.body.from);
            var date2 = new Date(req.body.to);
            Reports.find({ "agent.id": req.params.id, date: { $gt: date1, $lt: date2 } }, function (err, report) {
                if (err) {
                    res.redirect("back")
                } else {
                    Agents.findById(req.params.id, function (err, agent) {
                        if (err) {
                            res.redirect("back")
                        } else {
                            Statistic.find({ "agent.id": req.params.id }, function (err, statistics) {
                                if (err) {
                                    res.redirect("back")
                                } else {
                                    res.render("agents/show.ejs", { agent: agent, statistics: statistics, report: report })
                                }
                            })
                        }
                    })
                }
            })
        }
    })
})
//DELETE AGENT
route.delete("/:id", function (req, res) {
    Agents.findByIdAndRemove(req.params.id, function (err, agent) {

        if (err) {
            res.redirect("/agent");
        } else {
            res.redirect("/agent");
        }
    })
})
module.exports = route;