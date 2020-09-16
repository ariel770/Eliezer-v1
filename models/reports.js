var mongoose = require("mongoose");
var reportsSchema = new mongoose.Schema({
    agent: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Agents"
        },
        username: String
    },
    date:Date,
   meeting: Number,
    stickerFlyers: Number,
    learninGandRenewal: Number,
    negotiationsInTheProcess: Number,
    actualTransactions: Number,
    rentalTours: Number,
    collaborations: Number,
    conversationsWithPreviousClients: Number,
    pricesOffer: Number

})
module.exports = mongoose.model("Reports", reportsSchema);

