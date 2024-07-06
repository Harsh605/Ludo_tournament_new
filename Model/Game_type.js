const mongoose = require("mongoose")


const gameTypeSchema = new mongoose.Schema({
    Game: {
        type: String,
        required: true
    },
    file: {
        type: String,
        // required: true
    },
    variant:  [{
        variant_type: {
            type:String,
            required:true,
        },
    }],
}, { timestamps: true })

const GamePlay = mongoose.model("Game_Type", gameTypeSchema)

module.exports = GamePlay