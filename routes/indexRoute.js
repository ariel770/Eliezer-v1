var express = require('express');
var route = express.Router();
var Agents = require("../models/agents.js");
var Statistics = require("../models/statistic.js");
var passport = require('passport');
const middlewhereObj = require('../middlewhere/index.js');
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



route.get("/register", function (req, res) {
    console.log("@ in register get route @")

    res.render("agents/newAgent.ejs")
});




var userType;
route.post("/register", upload.single('image'), function (req, res) {
    console.log("@ in register post route @")

    if (req.body.username == process.env.MANAGER) {
        userType = 'manager'
    } else {
        userType = 'user'
    }
    console.log(process.env.MANAGER)
    var newuser = {
        username: req.body.username,
        UserType: userType, contact: req.body.contact,
        image: {
            data: fs.readFileSync(path.join('./public/uploads/' + req.file.filename)),
            contentType: 'image/png'
        }
    }

    console.log(newuser)
    Agents.register(new Agents(newuser), req.body.password, function (err, agent) {
        if (err) {
            console.log("A")
            console.log(err)
            return res.redirect("back")
        }
        console.log(agent)
        Agents.authenticate("local")(req, res, function () {
            console.log("B")
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