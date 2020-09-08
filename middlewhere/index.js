var middlewhereObj = {} ;

middlewhereObj.isLoggedIn = function (req,res,next){
   
    if(req.isAuthenticated()){
        return next();
    }
   res.redirect("/");
}
// middlewhereObj.isMannager = function (req,res,next){
   
//     if(req.isAuthenticated() && req.user.username == "PINJAS YAAKOB" ){
//         return next();
//     }
//    res.redirect("/agent"+req.user+"/report");
// }

module.exports = middlewhereObj;