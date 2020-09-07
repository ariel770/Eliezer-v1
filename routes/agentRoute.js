var express = require('express');
var route = express.Router();
var Reports = require("../models/reports.js");
var Statistic = require("../models/statistic.js");
var Agents = require("../models/agents.js");
const statistic = require('../models/statistic.js');

//SHOW ALL THE AGENTS (NEED TO SPECIFIC TO THE AGENT )
route.get("/agent", function (req, res) {
    Agents.find({}, function (err, agents) {
        if (err) {
            console.log(err)
        } else {
            res.render("agents/list.ejs", { agents: agents });
        }
    })

})

//CREATE NEW AGENT 
route.get("/agent/new", function (req, res) {
    res.render("agents/newAgent.ejs")
});




//INSERT TO DATABASE AND REDIRECT TO THE AGENT PAGE FORM 
route.post("/agent", function (req, res) {
    Agents.create(req.body.agent, function (err, agent) {
        if (err) {
            console.log(err)
        } else {
            var statistic = {
                agent: {
                    username: agent.username,
                    id: agent.id,
                },
                meetings: req.body.meetings, approachesToClosingDeal: req.body.approachesToClosingDeal, propertiesShowUp: req.body.propertiesShowUp,
                commissionFee: req.body.commissionFee, averageTransaction: req.body.averageTransaction, salesExclusivity: req.body.salesExclusivity, meetingsExclusivity: req.bodymeetingsExclusivity

            }
            Statistic.create(statistic, function (err, statistic) {
                if (err) {
                    console.log(err);
                } else {

                    res.redirect("/agent");
                }
            })
        }
    })

})

route.get("/agent/:id", function (req, res) {
    Agents.findById(req.params.id, function (err, agent) {
        if (err) {

        } else {
            Statistic.find({ "agent.id": req.params.id }, function (err, statistics) {
                if (err) {
                    console.log(err)
                } else {
                    res.render("agents/show.ejs", { agent: agent, statistics: statistics })
                }
            })
        }
    })

})

//EDIT SPECIFIC REPORT 
route.get("/agent/:id/edit", function (req, res) {

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
route.post("/agent/:id", function (req, res) {
    Agents.findByIdAndUpdate(req.params.id, req.body.agent, function (err, agent) {
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

module.exports = route;