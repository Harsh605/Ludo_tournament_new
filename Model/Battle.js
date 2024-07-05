const mongoose = require("mongoose")

const BattleSchema = new mongoose.Schema({
    Game_type: {
        type: String,
        required: true
    },
    Game_Ammount: {
        type: Number,
        required: true
    },
    Created_by: {
        type: String
    },
     winnAmount:{
        type: Number,
        default:null
    }
}, { timestamps: true })

const Battle = mongoose.model("Battle", BattleSchema)
module.exports = Battle