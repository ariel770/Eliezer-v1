var mongoose =require('mongoose');
 
var agentsSchema = new mongoose.Schema({
    name : String
})

module.exports = mongoose.model("Agents",agentsSchema)