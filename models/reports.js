var mongoose = require("mongoose");
var reportsSchema = new mongoose.Schema({
    agent: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Agents"
        },
        username: String
    },
    statistics: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Statistics"
        }
    },
    date: Date,
    meeting: Number,
    stickerFlyers: Number,
    learninGandRenewal: Number,
    negotiationsInTheProcess: Number,
    actualTransactions: Number,
    rentalTours: Number,
    collaborations: Number,
    conversationsWithPreviousClients: Number,
    pricesOffer: Number,
    remarks: String

})
module.exports = mongoose.model("Reports", reportsSchema);

