
var mongoose = require('mongoose');

var statisticsSchema = new mongoose.Schema({
    agent: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Agents"
        },
        username: String
    },
   meetings: Number,
    approachesToClosingDeal: Number,
    interestedWhoeBuying: Number,
    propertiesShowUp: Number,
    commissionFee: Number,
    averageTransaction: Number,
    salesExclusivity: Number,
    meetingsExclusivity: Number,

})
module.exports = mongoose.model("Statistics", statisticsSchema);
