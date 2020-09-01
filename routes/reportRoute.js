var express = require('express');
var route = express.Router();
var Reports = require("../models/reports.js");


route.get("/",function(req,res){
  
    Reports.find({},function(err,report){
        if(err){
            console.log(err)
        }else{
            res.render("report/report.ejs",{report:report});
        }
    })

})

route.post("/",function(req,res){
  console.log(req.body.tours);

  Reports.create({tours:req.body.tours},function(err,report){
      if(err){
          console.log(err)
      }else{
          console.log(report)
          res.redirect("/");
      }
  })
    
})
module.exports = route;