var middlewhereObj = {};


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

 

module.exports = middlewhereObj;