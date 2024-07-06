const mongoose = require("mongoose")

const transactionSchema = new mongoose.Schema({
    cf_order_id: {
        type: String,
    },
    order_id: {
        type: String,
    },
    upi_app: {
        type: String,
    },
    User_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    amount: {
        type: Number,
        required: true
    },
    upi_no: {
        type: Number,
        default: null,
    },
    closing_balance: {
        type: Number,
        default: null,
    },
    Withdraw_type: {
        type: String,
        default: null
    },
    Req_type: {
        type: String,
        default: null
    },
    client_ip: {
        type: String,
        default: null
    },
    client_forwarded_ip: {
        type: String,
        default: null
    },
    client_remote_ip: {
        type: String,
        default: null
    },
    action_by: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: "User",//Added By team
        default: null
    },
    payment_gatway: {
        type: String,
        default: null
    },
    varified_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
    },
    referred_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
    },
    status: {
        type: String,
        default: "none"
    },
    Status_reason: {
        type: String,
    },
    order_token: {
        type: String,
    },
    referenceId: {
        type: String,
        default: null
    },
    txn_msg: {
        type: String,
        default: null
    },
    Transaction_Screenshot: {
        type: String,
        default: null
    }
}, { timestamps: true })

const Transaction = mongoose.model("transaction", transactionSchema)
module.exports = Transaction