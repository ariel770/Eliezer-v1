require('dotenv').config();
var express = require("express");
var app = express();
var bodyParser =require('body-parser');
var mongoose = require('mongoose');
var reportRoute = require('./routes/reportRoute'),
    agentRoute = require('./routes/agentRoute');
var methodOverride           = require('method-override');


    app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(reportRoute);
app.use(methodOverride("_method"));

mongoose.connect(process.env.DATABASEURL,{useNewUrlParser:true,
useCreateIndex:true}).then(()=>{
   console.log("CONNECTED TO DB") 
}).catch((err) => {
        console.log("ERROR!!!"+err);

});

var server_port = process.env.YOUR_PORT || process.env.PORT || 3000;
var server_host = process.env.YOUR_HOST || '0.0.0.0';

app.listen(server_port, server_host, function() {
    console.log('Listening on port %d', server_port);
});



// app.listen(3000, "localhost", function (req, res) {

//     console.log("server is ready  ... ")
// })
