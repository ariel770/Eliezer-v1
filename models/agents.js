var mongoose = require('mongoose');
var PassportLocalMongoose = require('passport-local-mongoose');
var agentsSchema = new mongoose.Schema({
    contact: {
        phone: Number,
        email: String,
    },
    reports: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Report"
        }
    ],
    statistic: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Statistics"
        },
    },
    username: String,
    status: String,
    passport: String,
    UserType: String,

});
agentsSchema.plugin(PassportLocalMongoose)
module.exports = mongoose.model("Agents", agentsSchema);