var express = require('express');
var route = express.Router();
var Agents = require("../models/agents.js");
var passport = require('passport');

//AUTH ROUTE  == REGISER

route.get("/register", function (req, res) {
    res.render("indexview/register.ejs");
})

route.post("/register", function (req, res) {
    var newuser = { username: req.body.username, UserType: 'user', contact: req.body.contact }
    Agents.register(new Agents(newuser), req.body.password, function (err, agent) {
        console.log("newAgent :  " + agent);
        if (err) {
         
            return res.render("indexview/register.ejs")
        }

        Agents.authenticate("local")(req, res, function () {

            res.redirect("/report");

        })

    })


})



route.get("/login", function (req, res) {

    res.render("indexview/login.ejs");

})

route.post("/login", passport.authenticate("local", {
    successRedirect: "/report",
    failureRedirect: "/login"
}), function (req, res) {

})
// //AUTH ROUTE  == LOGIN
// route.get("/login/:id", function (req, res) {

//     res.render("indexview/login.ejs", { report: req.params.id });

// })

// route.post('/login/:id', function (req, res, next) {
//     passport.authenticate('local', { failureFlash: true }, function (err, user, info) {
//         if (err) { return next(err); }
//         if (!user) { return res.redirect('/login'); }
//         req.logIn(user, function (err) {
//             if (err) { return next(err); }
//             return res.redirect('/report/' + req.params.id);
//         });
//     })(req, res, next);
// });


//AUTH ROUTE  == LOGOUT

route.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/login");
})

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
   res.redirect("/login");
}
module.exports = route;