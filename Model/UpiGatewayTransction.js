const mongoose = require("mongoose")


const upiGatewayTransactionSchema = new mongoose.Schema({
    User_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    txn_id: {
        type: String,
        required: true,
    },
    customer_name: {
        type: String,
    },
    customer_mobile: {
        type: String,
        required: true
    },
    customer_email: {
        type: String,
        required: true
    },
    depositAmount: {
        type: Number,
        required: true
    },
    oldAmount: {
        type: Number,
        required: true
    },
    client_txn_id: {
        type: String,
        required: true
    },
    upi_txn_id: {
        type: String,
        required: true
    },
    ip: {
        type: String,
    },
    createdAt: {
        type: Date,
    },
    txnAt: {
        type: Date,
    },
    status: {
        type: String,
    },
    customer_vpa: {
        type: String,
    },



}, { timestamps: true })

const upiGatewayMyTransaction = mongoose.model("upiGatewayMyTransaction", upiGatewayTransactionSchema)

module.exports = upiGatewayMyTransaction