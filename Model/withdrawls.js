const mongoose = require("mongoose")

const UserEarningsSchema = new mongoose.Schema({
    User_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    withdrawl_ammount: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    upi_app: {
        type: String,
        required: true
    },
    Status: {
        type: String,
        default: null
    },
    Status_updated_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
    Status_reason: {
        type: String,
        default: null
    },
    txt_id: {
        type: String,
        default: null
    },
    approved_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },

    upi_id: {
        type: String,
        required: true
    },
}, { timestamps: true })

const Withdrawl = mongoose.model("withdrawl", UserEarningsSchema)
module.exports = Withdrawl