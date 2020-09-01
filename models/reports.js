var mongoose = require("mongoose");
var reportsSchema = new mongoose.Schema({
    // agent: {
    //     id: mongoose.Schema.Types.ObjectId,
    //     ref: "Agents"
    // },
    tours: Number
})
module.exports = mongoose.model("Reports", reportsSchema);

