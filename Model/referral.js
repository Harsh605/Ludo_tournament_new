const mongoose = require("mongoose")

const tempSchema = new mongoose.Schema({

    earned_from: {
         type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    referral_code:{
        type:String,
        default:null
    },
    amount: {
        type: Number,
        default: null
    },
    closing_balance:{
        type:Number,
        default:null
    }

},{timestamps:true})

const ReferralHis = mongoose.model("ReferralHis", tempSchema)

module.exports = ReferralHis