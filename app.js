var express = require("express");
var app = express();
var bodyParser =require('body-parser');
var mongoose = require('mongoose');
var reportRoute = require('./routes/reportRoute'),
    agentRoute = require('./routes/agentRoute');
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(reportRoute);
// mongoose.connect("mongodb://localhost:27017/eliezer_v1",{useNewUrlParser:true});
mongoose.connect("mongodb+srv://pinjas:pinjas@cluster0.s9va8.mongodb.net/<dbname>?retryWrites=true&w=majority",{useNewUrlParser:true,
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
