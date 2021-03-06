require('dotenv').config();
require('datejs')
var express = require("express");
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Agents = require('./models/agents.js');
var reportRoute = require('./routes/reportRoute');
var agentRoute = require('./routes/agentRoute');
var indexRoute = require('./routes/indexRoute');
app.use(bodyParser.json())
var methodOverride = require('method-override');

var passport = require('passport'),
    LocalStrategy = require('passport-local'),
    PassportLocalMongoose = require('passport-local-mongoose');

// ==> THE APP RECOGNIZES THE DESIGN FOLDER   
// ================================
app.use(express.static(__dirname + "/public"));

// ==> LETS UPDATE WITH PUT COMMAND
// ================================
app.use(methodOverride("_method"));

// ==> PASSPORT CONFIGURATE
// ================================
app.use(require('cookie-parser')());
app.use(require('express-session')({
    secret: "Mendel chono is the best cuted in the worlld",
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(Agents.authenticate()));
passport.serializeUser(Agents.serializeUser());
passport.deserializeUser(Agents.deserializeUser());


// ==> USE VARIABLES IN ALL THE APP  
// ================================ 

app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.report = "";
    next();
})

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

// ==> NOUNT THE ROUTERS IN APP 
app.use(indexRoute);
app.use("/agent", agentRoute);
app.use(reportRoute);

// ==> CONNECT WITH DATABASE  (MongoDB Compass / MongoDB Atlas)  
// ================================ 
mongoose.connect(process.env.DATABASEURL, {
    useNewUrlParser: true,
    useCreateIndex: true
}).then(() => {
    console.log("CONNECTED TO DB")
}).catch((err) => {
    console.log("ERROR!!!" + err);

});

// ==> CONNECT WITH SERVER  
// ================================ 
var server_port = process.env.YOUR_PORT || process.env.PORT || 3000;
var server_host = process.env.YOUR_HOST || '0.0.0.0';

app.listen(server_port, server_host, function () {
    console.log('Listening on port %d', server_port);
});
