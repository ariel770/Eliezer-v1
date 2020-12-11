var middlewhereObj = {};
var fs = require('fs');
var path = require('path');
var multer = require('multer');

middlewhereObj.isLoggedIn = function (req, res, next) {

    if (req.isAuthenticated()) {

        return next();
    }
    res.redirect("/");
}
middlewhereObj.isUser = function (req, res, next) {

    if (req.isAuthenticated() && req.user.username !== process.env.MANAGER) {

        return next();
    }
    res.redirect("/");
}
middlewhereObj.isMannager = function (req, res, next) {

    if (req.isAuthenticated() && req.user.username == process.env.MANAGER) {

        return next();
    } else if (req.isAuthenticated()) {

        res.redirect("/agent/" + req.user.id + "/report/new");
    } else {
        res.redirect("/");
    }
}
// middlewhereObj.confirm  =function(req,res,next){

//       res.render("confirm.ejs")
// }
 
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});
 
var upload = multer({ storage: storage });
module.exports = middlewhereObj;