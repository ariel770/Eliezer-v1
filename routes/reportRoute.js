var express = require('express');
var route = express.Router();
var Reports = require("../models/reports.js");
var middlewhere  = require('../middlewhere/index.js');
const Agents = require('../models/agents.js');

//SHOW ALL THE REPORT (NEED TO SPECIFIC TO THE AGENT )
route.get("/report",middlewhere.isLoggedIn, function (req, res) {

    Reports.find({}, function (err, report) {
        if (err) {
            console.log(err)
        } else {
            res.render("report/list.ejs", { report: report });
        }
    })

})

//CREATE NEW REPORT 
route.get("/report/new", function (req, res) {
    res.render("report/newReport.ejs")

});




//INSERT TO DATABASE AND REDIRECT TO THE REPORT PAGE FORM 
route.post("/report", function (req, res) {
  
console.log("req.user"+ req.user);

  Agents.findById(req.user ,function(err,agents){
      if(err){

      }else{
        Reports.create(req.body.report, function (err, report) {
            if (err) {
                console.log(err)
            } else {
                agents.reports.push(report.id);
                agents.save();
                res.redirect("/report/new");
            }
        })
      }
  })
  
  
  

})

route.get("/report/:id", function (req, res) {
    Reports.findById(req.params.id,function(err,report){
       if(err){
     
         console.log(err)
        }else{
 
        res.render("report/show.ejs",{report:report})
       }
    })
    
})

//EDIT SPECIFIC REPORT 
route.get("/report/:id/edit", function (req, res) {
   
    Reports.findById(req.params.id, function (err, report) {
        if (err) {
            console.log(err)
        } else {
            res.render("report/editReport.ejs", { report: report })
        }
    })


});

//INSERT THE FIX REPORT TO THE DB
route.post("/report/:id", function (req, res) {
    console.log(req.params.id)
    Reports.findByIdAndUpdate(req.params.id, req.body.report, function (err, report) {
        if (err) {
            console.log(err)
        } else {
            res.redirect("/report/"+req.params.id)
        }
    })

});

module.exports = route;