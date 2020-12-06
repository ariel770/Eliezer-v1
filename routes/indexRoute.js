var express = require('express');
var route = express.Router();
var Agents = require("../models/agents.js");
var Statistics = require("../models/statistic.js");
var passport = require('passport');
const middlewhereObj = require('../middlewhere/index.js');

//AUTH ROUTE  == REGISER

route.get("/register", function (req, res) {
    res.render("agents/newAgent.ejs")
});
var userType ;
route.post("/register", function (req, res) {
    if(req.body.username == process.env.MANAGER){
        userType = 'manager'
    }else{
        userType = 'user'
    }
    console.log(req.body.image)
    var newuser = {username: req.body.username, UserType: userType, contact: req.body.contact,image:req.body.image}
 
    console.log(newuser)
    console.log(newuser)
    Agents.register(new Agents(newuser), req.body.password, function (err, agent) {
        if (err) { 
              
            return res.redirect("back")
        }
    console.log(agent)
        Agents.authenticate("local")(req, res, function () {
            console.log("authenticate success ... ");
            res.redirect("/agent")
        })
    })
})


route.get("/", function (req, res) {

    res.render("indexview/login.ejs");

})

route.post("/", passport.authenticate("local", {

    successRedirect: "/agent",
    failureRedirect: "/"
}), function (req, res) {

})

//AUTH ROUTE  == LOGOUT

route.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
})

module.exports = route;