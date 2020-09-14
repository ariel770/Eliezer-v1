var express = require('express');
var route = express.Router();
var Reports = require("../models/reports.js");
var Statistic = require("../models/statistic.js");
var Agents = require("../models/agents.js");
const middlewhereObj = require('../middlewhere/index.js');

var currentStatistic = {
     newmeeeting: String
}
var suMeetings




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
});




// //INSERT TO DATABASE AND REDIRECT TO THE AGENT PAGE FORM 
// route.post("/", function (req, res) {
//     Agents.create(req.body.agent, function (err, agent) {
//         if (err) {
//             console.log(err)
//         } else {
//             var statistic = {
//                 agent: {
//                     username: agent.username,
//                     id: agent.id,
//                 },
//                 meetings: req.body.meetings, approachesToClosingDeal: req.body.approachesToClosingDeal, propertiesShowUp: req.body.propertiesShowUp,
//                 commissionFee: req.body.commissionFee, averageTransaction: req.body.averageTransaction, salesExclusivity: req.body.salesExclusivity, meetingsExclusivity: req.bodymeetingsExclusivity

//             }
//             Statistic.create(statistic, function (err, statistic) {
//                 if (err) {
//                     console.log(err);
//                 } else {
//                     agent.statistic.push(statistic.id)
//                     agent.save();
//                     res.redirect("/agent")

//                 }
//             })
//         }
//     })

// })
//SHOW A SPECIFIC AGENT (WITH A  STATISTIC)
route.get("/:id", function (req, res) {
    Agents.findById(req.params.id, function (err, agent) {
        if (err) {

        } else {
            Statistic.find({ "agent.id": req.params.id }, function (err, statistics) {
                if (err) {
                    console.log(err)
                } else {
                    console.log("=====1====")
                    console.log(statistics)
                    console.log("=====2====")
                    Reports.find({ "agent.id": req.params.id }, function (err, report) {
                        if (err) {
                            res.redirect("back")
                        } else {
                            console.log("=====1====")
                            console.log(report)
                            console.log("=====2====")
                            for (i = 0; i < report.length; i++) {
                                for (b = 0; b < statistics.length; b++) {

                                    if (statistics[b].meetings = report[i].meeting) {
                                       suMeetings = statistics[b].meetings - report[i].meeting
                                        currentStatistic.meetings = suMeetings;
                                    } else {
                                        console.log("IS inCORRECT")

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

//EDIT SPECIFIC REPORT 
route.get("/:id/edit", function (req, res) {

    Agents.findById(req.params.id, function (err, agent) {
        if (err) {
            console.log(err)
        } else {
            Statistic.find({ "agent.id": req.params.id }, function (err, statistics) {
                if (err) {
                    console.log(err)
                } else {
                    res.render("agents/editAgent.ejs", { agent: agent, statistics: statistics })
                }
            })
        }
    })


});

//INSERT THE FIX REPORT TO THE DB
route.put("/:id", function (req, res) {
    Agents.findByIdAndUpdate(req.params.id, req.body.agent, function (err, agent) {
        console.log("update :");

        if (err) {
            console.log(err)
        } else {
            var statistic = {
                agent: {
                    username: agent.username,
                    id: agent.id,
                },
                meetings: req.body.meetings,
                approachesToClosingDeal: req.body.approachesToClosingDeal,
                interestedWhoeBuying: req.body.interestedWhoeBuying,
                propertiesShowUp: req.body.propertiesShowUp,
                commissionFee: req.body.commissionFee,
                averageTransaction: req.body.averageTransaction,
                salesExclusivity: req.body.salesExclusivity,
                meetingsExclusivity: req.body.meetingsExclusivity
            }
            Statistic.findOneAndUpdate({ "agent.id": req.params.id }, statistic, function (err, statistics) {
                if (err) {
                    console.log(err)
                } else {
                    console.log(statistics)
                    res.redirect("/agent/" + req.params.id)
                }
            })
        }
    })

});
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