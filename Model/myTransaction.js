const mongoose = require("mongoose")


const transactionSchema = new mongoose.Schema({
    User_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    User2_id: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
        ref: "User"
    },
    Game_id: {
        type: mongoose.Schema.Types.ObjectId,
        // required: true,
        ref: "Game_Type"
    },
    txn_type: {
        type: String,
        default: null
    },
    Amount: {
        type: Number,
        required: true
    },
    Remark: {
        type: String,
        // required: true
    },
    season: {
        type: String,
        default: null
    }

}, { timestamps: true })

const myTransaction = mongoose.model("myTransaction", transactionSchema)

module.exports = myTransaction