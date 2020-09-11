var middlewhereObj = {} ;

middlewhereObj.isLoggedIn = function (req,res,next){
   
    if(req.isAuthenticated()){
        return next();
    }
   res.redirect("/");
}
middlewhereObj.isMannager = function (req,res,next){
//    console.log(req.user.username)
//    console.log(process.env.MANAGER)
//     if(req.isAuthenticated() && req.user.username == process.env.MANAGER){
//     }
    return next();
//    res.redirect("/agent/"+req.user+"/report");
}

module.exports = middlewhereObj;