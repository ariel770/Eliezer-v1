var express = require('express');
var route = express.Router();
var Reports = require("../models/reports.js");
var Statistic = require("../models/statistic.js");
var Agents = require("../models/agents.js");
const middlewhereObj = require('../middlewhere/index.js');
const statistic = require('../models/statistic.js');
var ObjectId = require('mongodb').ObjectID;
var path = require('path');
var multer = require('multer');
var fs = require('fs');


//  set storage engine
var storage = multer.diskStorage({
    destination: './public/uploads',
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)
        )
    }
});
// init upload
var upload = multer({

    limits: { fileSize: 1000000 },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
    storage: storage
});

// check files 
function checkFileType(file, cb) {

    var fileType = /jpg|jpeg|png|gif/;

    var extname = fileType.test(path.extname(file.originalname).toLowerCase());

    var mimetype = fileType.test(file.mimetype)

    if (extname && mimetype) {
        return cb(null, true)
    } else {
        cb('Error : Images Only ')
    }

}


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




//GET REPORTS BETWEEN 2 DAYS
route.post("/getListReports/:id", function (req, res) {
    var date1 = new Date(req.body.from);
    var date2 = new Date(req.body.to);
    Reports.find({ "agent.id": req.params.id, date: { $gt: date1, $lt: date2 } }).sort({ date: -1 }).exec(function (err, report) {
        if (err || report.length == 0) {
            console.log("error ! " + err)
            res.render("agents/specificListReports.ejs", { err: err })
        } else {
            res.render("agents/specificListReports.ejs", { report: report, err: "" })
        }
    })
})

//GET STATISTICS BETWEEN 2 DAYS
route.post("/getListStatistics/:id", function (req, res) {
    var date1 = new Date(req.body.from)
    var date2 = new Date(req.body.to)
    Reports.aggregate([
        {
            $sort: { date: 1 }
        },
        {
            $match: {

                'agent.id': ObjectId(req.params.id), "date": { '$gte': date1, '$lte': date2 }
            }
        }, {
            $group: {

                _id: {
                    year: { '$year': '$date' },
                    month: { '$month': '$date' },
                    statistics: '$statistics.id'
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
        {
            $sort: { '_id.month': -1 }
        }
    ], function (err, report) {
        if (err) {

        } else {
            Statistic.find({ date: { '$gte': date1, '$lte': date2 }, "agent.id": req.params.id }).sort({ date: -1 }).exec(function (err, statistics) {
                if (err) {
                    res.redirect("back")
                } else {
                    res.render("agents/specificListStatistics.ejs", { report: report, statistics: statistics });

                }

            })


        }


    })


})

route.get("/getListComment/:id", function (req, res) {

    Agents.findById(req.params.id, function (err, agent) {
        if (err) {
            console.log(err)
            res.redirect("back")
        } else {

            res.render("agents/specificListComments.ejs", { agent: agent, err: "" })
        }
    })
})
//SHOW A SPECIFIC AGENT (WITH A LAST  STATISTIC ======> FROM LAST MONTH ?<====(CURRENT STATISTICS))
route.get("/:id", function (req, res) {

    Agents.findById(req.params.id, function (err, agent) {
        if (err) {
            console.log(" you have a big problem2  : " + err)
        } else {
            Reports.aggregate([
                {
                    $match: {
                        'agent.id': ObjectId(req.params.id),
                    }
                }, {
                    $group: {

                        _id: {
                            statistics: '$statistics.id',
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
                },

                { $sort: { "_id": 1 } },
                { $limit: 1 },
            ], function (err, reportGoal) {

                if (err) {
                    res.redirect("back")

                } else {
                    Statistic.findOne({ "agent.id": req.params.id }, {}, { sort: { 'date': -1 } }, function (err, statistics) {
                        if (err) {
                            res.redirect("back")
                        } else if (statistics == null && reportGoal == 0) {
                            res.render("agents/testShow.ejs", { agent: agent, statistics: "", reportGoal: "" })
                        } else if (reportGoal == 0) {
                            res.render("agents/testShow.ejs", { agent: agent, statistics: statistics, reportGoal: "" })

                        } else if (statistics == null) {
                            res.render("agents/testShow.ejs", { agent: agent, statistics: "", reportGoal: reportGoal })

                        } else {

                            res.render("agents/testShow.ejs", { agent: agent, statistics: statistics, reportGoal: reportGoal })
                        }
                    })
                }
            })
        }
    })
})

//SET STATISTICS
route.get("/:id/setgoals", function (req, res) {

    Agents.findById(req.params.id, function (err, agent) {
        if (err) {
            res.redirect("back");
        } else {
            res.render("agents/setgoals.ejs", { agent: agent })
        }
    })



})

//ADD THE STATISTICS TO DB
route.post("/:id/setgoals", function (req, res) {

    Agents.findById(req.params.id, function (err, agent) {
        if (err) {
            res.redirect("back")
        } else {

            var id = agent.id;
            var username = agent.username;
            var status = req.body.filter

            var a = {
                agent: { id: id, username: username, status: status }, date: new Date(), meeting: req.body.meeting,
                stickerFlyers: req.body.stickerFlyers, learninGandRenewal: req.body.learninGandRenewal,
                negotiationsInTheProcess: req.body.negotiationsInTheProcess, actualTransactions: req.body.actualTransactions,
                rentalTours: req.body.rentalTours, collaborations: req.body.collaborations,
                conversationsWithPreviousClients: req.body.conversationsWithPreviousClients, pricesOffer: req.body.pricesOffer
            }

            Statistic.create(a, function (err, statistics) {
                if (err) {
                    console.log("ERROR   :  " + err)
                    res.redirect("back");
                } else {
                    agent.status = statistics.agent.status;
                    agent.statistic.push(statistics.id);
                    agent.save();
                    console.log(statistics)
                    res.redirect("/agent/" + req.params.id)
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
route.put("/:id/addComment", function (req, res) {
    var comment = {
        date: new Date(),
        newComment: req.body.comment
    }
    Agents.findById(req.params.id, function (err, agent) {
        agent.comment.push(comment)
        agent.save();
        if (err) {
            console.log(err)
        } else {
            res.redirect("/agent/" + req.params.id)
        }
    })

})
//INSERT THE FIX AGENTS TO THE DB
route.put("/:id",  upload.single('image'),function (req, res) {
    var agent = {
        contact: {
            phone: req.body.phone,
            email: req.body.email
        },
        username: req.body.username,
        image: {
            data: fs.readFileSync(path.join('./public/uploads/' + req.file.filename)),
            contentType: 'image/png'
        }
    

    }



    Agents.findByIdAndUpdate(req.params.id, agent, function (err, agent) {
  
        if (err) {
            console.log(err)
        } else {
            res.redirect("/agent/" + req.params.id)
        }
    })

});


// DELETE COMPLETE AGENTS DETAILLS 
route.delete("/:id", function (req, res) {
    console.log("delete ======= person")
    Agents.findByIdAndDelete(req.params.id, function (err, agent) {

        if (err) {
            res.redirect("/agent");
        } else {
            Reports.find({ "agent.id": req.params.id }, function (err, reports) {
                if (err) {
                    res.redirect("/agent");
                } else {
                    Reports.findByIdAndRemove(reports, function (err, reports) {
                        if (err) {
                            res.redirect("/agent");
                        } else {
                            Statistic.find({ "agent.id": req.params.id }, function (err, statistics) {
                                if (err) {
                                    res.redirect("/agent");
                                } else {
                                    Statistic.findByIdAndDelete(statistics, function (err, statistics) {
                                        if (err) {
                                            res.redirect("/agent");
                                        } else {
                                            res.redirect("/agent");

                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })
        }
    })
})


function getStatistics(money, status, id, username) {

    var sumaPorPropiedad;

    if (status == "comersial") {
        sumaPorPropiedad = 20000;
    } else {
        sumaPorPropiedad = 30000
    }
    var cantidadDePropiedadesN = money / sumaPorPropiedad;

    var reunionesParaCerarrNegocio = cantidadDePropiedadesN * 20
    var pegarStickers = reunionesParaCerarrNegocio * 2



    var a = {
        agent: { id: id, username: username }, date: new Date(), meeting: reunionesParaCerarrNegocio / 12,
        stickerFlyers: pegarStickers / 12, learninGandRenewal: 2, learninGandRenewal: 3,
        negotiationsInTheProcess: 4, actualTransactions: 5, rentalTours: 6, collaborations: 7,
        conversationsWithPreviousClients: 8, pricesOffer: 9
    }

    return a;
}
module.exports = route;