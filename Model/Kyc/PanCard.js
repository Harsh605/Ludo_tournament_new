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
    FatherName: {
        type: String,
        // required: true
    },
    DOB: {
        type: String,
        required: true
    },
    Gender: {
        type: String,
        // required: true
    },
    Number: {
        type: Number,
        required: true
    },
    docs: {
        type: String,
        default: true
    }

}, {
    timestamps: true
})

const PanCard = mongoose.model("PanCard", AadharSchema)
module.exports = PanCard