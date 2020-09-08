var express = require('express');
var route = express.Router();
var Reports = require("../models/reports.js");
const Agents = require('../models/agents.js');
const middlewhereObj = require('../middlewhere/index.js');

route.get("/",middlewhereObj.isLoggedIn, function (req, res) {

    Reports.find({}, function (err, report) {
        if (err) {
            console.log(err)
        } else {
            Agents.findById(req.user,function(err,agents){
                res.render("report/list.ejs", { report: report,agents:agents});
            })
        }
    })

})

//CREATE NEW REPORT 
route.get("/new", function (req, res) { 

    Agents.findById(req.user,function(err,agents){
      

        res.render("report/newReport.ejs", {agents:agents})
    })

});




//INSERT TO DATABASE AND REDIRECT TO THE REPORT PAGE FORM 
route.post("/", function (req, res) {
  Agents.findById(req.user ,function(err,agents){
      if(err){

      }else{
        Reports.create(req.body.report, function (err, report) {
            if (err) {
                console.log(err)
            } else {
                agents.reports.push(report.id);
                agents.save();
                res.redirect("/agent/"+agents.id+"/report/new");
            }
        })
      }
  })
  
  
  

})

route.get("/:report_id", function (req, res) {


    Agents.findById(req.user,function(err ,agents){
        if(err){
        }else{
            Reports.findById(req.params.report_id,function(err,report){
                if(err){
                    console.log(err)
                }else{
                res.render("report/show.ejs",{report:report ,agents:agents});
               }
            })
        }
    })
})

//EDIT SPECIFIC REPORT 
route.get("/:report_id/edit", function (req, res) {
   Agents.findById(req.user,function(err,agents){
       if(err){
           console.log(err)
       }else{
           Reports.findById(req.params.report_id, function (err, report) {
               if (err) {
                   console.log(err)
               } else {
                   res.render("report/editReport.ejs", {agents:agents ,report: report })
               }
           })

       }
   })


});

//INSERT THE FIX REPORT TO THE DB
route.post("/:id", function (req, res) {
    console.log(req.params.id)
    Reports.findByIdAndUpdate(req.params.id, req.body.report, function (err, report) {
        if (err) {
            console.log(err)
        } else {
            res.redirect("/agent/"+req.user+"/report/"+req.params.id)
        }
    })

});

module.exports = route;