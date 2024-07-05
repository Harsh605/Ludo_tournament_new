const mongoose = require("mongoose")

const UserEarningsSchema = new mongoose.Schema({
    Type: {
        type: String,
        required: true
    },
    Desc: {
        type: String,
        required: true
    },
}, { timestamps: true })

const TermCon = mongoose.model("Term_Condition", UserEarningsSchema)
module.exports = TermCon