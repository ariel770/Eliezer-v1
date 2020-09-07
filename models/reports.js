var mongoose = require("mongoose");
var reportsSchema = new mongoose.Schema({
    agent: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Agents"
        },
        username: String
    },
    tours: Number,
    meeting:Number
})
module.exports = mongoose.model("Reports", reportsSchema);

