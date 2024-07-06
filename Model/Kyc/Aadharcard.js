const mongoose = require("mongoose")

const AadharSchema = new mongoose.Schema({
    User: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    Name: {
        type: String,
        required: true
    },
    DOB: {
        type: String,
        required: true
    },
    Gender: {
        type: String,
        default: null
    },
    Number: {
        type: Number,
        required: true
    },
    Address: {
        type: String,
        default: null
    },
    front: {
        type: String,
        required: true
    },
    back: {
        type: String,
        required: true
    },
    verified: {
        type: String,
        default: "unverified"
    },

}, {
    timestamps: true
})

const AadharCard = mongoose.model("AadharCard", AadharSchema)
module.exports = AadharCard