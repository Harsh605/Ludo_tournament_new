const mongoose = require("mongoose")

const tempSchema = new mongoose.Schema({

    type: {
        type: String,
        default: null
    },
    upi_no: {
        type: String,
        default: null
    },
    amount: {
        type: Number,
        required: true
    },
    front: {
        type: String,
        default: null
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    txn_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "transaction"
    },
    status: {
        type: String,
        default: "pending"
    },
    closing_balance: {
        type: Number,
        default: null
    },
    Req_type: {
        type: String,
        default: null
    },
    Transaction_Screenshot: {
        type: String,
        default: null
    }

}, { timestamps: true })

const Temp = mongoose.model("Temp", tempSchema)

module.exports = Temp