const mongoose = require("mongoose")

const tempSchema = new mongoose.Schema({

    amount: {
        type: Number,
        required: true
    },
    upi: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    type: {
        type: String,
    default:"UPI"
    }

})

const Temp = mongoose.model("Withdraw", tempSchema)

module.exports = Temp