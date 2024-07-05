const mongoose = require("mongoose")

const UserEarningsSchema = new mongoose.Schema({
    User_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    Earned_Form: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    Ammount: {
        type: Number,
        required: true
    },
    Game_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Game_Type"
    },
},  { timestamps: true })

const UserEarnin = mongoose.model("UserEarning", UserEarningsSchema)
module.exports = UserEarnin