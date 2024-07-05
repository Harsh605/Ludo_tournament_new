const mongoose = require("mongoose")

const UserEarningsSchema = new mongoose.Schema({
   
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
}, { timestamps: true })

const AdminEarning = mongoose.model("AdminEarning", UserEarningsSchema)
module.exports = AdminEarning