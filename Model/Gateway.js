const mongoose = require("mongoose")

const GatewaySettingSchema = new mongoose.Schema({
    RazorPayout:{
        type: Boolean,
        default: null
    },
    RazorDeposit:{
        type: Boolean,
        default: null
    },
    RazorpayAuto:{
        type: Boolean,
        default: null
    },
    decentroPayout:{
        type: Boolean,
        default: null
    },
    decentroDeposit:{
        type: Boolean,
        default: null
    },
    decentroAuto:{
        type: Boolean,
        default: null
    },
    RazorPayKey:{
        type: String,
        default: null
    },
    RazorPaySecretKey:{
        type: String,
        default: null
    },
    AccountName:{
        type: String,
        default: null
    }

})

const GatewaySettings = mongoose.model("GatewaySettings",GatewaySettingSchema)
module.exports = GatewaySettings