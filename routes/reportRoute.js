var express = require('express');
var route = express.Router();
var Reports = require("../models/reports.js");

//SHOW ALL THE REPORT (NEED TO SPECIFIC TO THE AGENT )
route.get("/", function (req, res) {

    Reports.find({}, function (err, report) {
        if (err) {
            console.log(err)
        } else {
            res.render("report/list.ejs", { report: report });
        }
    })

})

//CREATE NEW REPORT 
route.get("/new", function (req, res) {
    res.render("report/newReport.ejs")

});




//INSERT TO DATABASE AND REDIRECT TO THE REPORT PAGE FORM 
route.post("/", function (req, res) {
    Reports.create(req.body.report, function (err, report) {
        if (err) {
            console.log(err)
        } else {
            res.redirect("/report/new");
        }
    })

})

route.get("/:id", function (req, res) {
    Reports.findById(req.params.id,function(err,report){
       if(err){
     
         console.log(err)
        }else{
 
        res.render("report/show.ejs",{report:report})
       }
    })
    
})

//EDIT SPECIFIC REPORT 
route.get("/:id/edit", function (req, res) {
   
    Reports.findById(req.params.id, function (err, report) {
        if (err) {
            console.log(err)
        } else {
            res.render("report/editReport.ejs", { report: report })
        }
    })


});

//INSERT THE FIX REPORT TO THE DB
route.post("/:id", function (req, res) {
    Reports.findByIdAndUpdate(req.params.id, req.body.report, function (err, report) {
        if (err) {
            console.log(err)
        } else {
            res.redirect("/report/"+req.params.id)
        }
    })

});

module.exports = route;