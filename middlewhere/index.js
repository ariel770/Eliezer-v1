var middlewhereObj = {};

middlewhereObj.isLoggedIn = function (req, res, next) {

    if (req.isAuthenticated() && req.user.username !== process.env.MANAGER) {
        return next();
    }
    res.redirect("/");
}
middlewhereObj.isMannager = function (req, res, next) {

    if (req.isAuthenticated() && req.user.username == process.env.MANAGER) {
        console.log("is manager")
        return next();
    } else if (req.isAuthenticated()) {
        console.log("is user")
        res.redirect("/agent/" + req.user.id + "/report/new");
    } else {
        res.redirect("/");
    }
}

module.exports = middlewhereObj;