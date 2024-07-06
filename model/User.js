const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({

    user_type: {
        type: String,
        required: true
    },
    Name: {
        type: String,
        required: true
    },
    Email: {
        type: String,
        default: null
    },
    Email_varified_at: {
        type: Date,
        default: null
    },
    Phone: {
        type: Number,
        required: true,
        unique: true,
        minlength: 10,
        maxlength: 10
    },
    Mobile_varified_at: {
        type: Date,
        default: null
    },
    Password: {
        type: String,
        required: true
    },
    Referred_By: {
        type: Number,
        default: null
    },
    Register_by: {
        type: String,
        default: "Self"
    },
    Wallet_balance: {
        type: Number,
        default: 0
    },
    hold_balance: {
        type: Number,
        default: 0
    },
    device_key: {
        type: String,
        default: null
    },
    ref_Commision: {
        type: Number,
        default: 1
    },
    temp_token: {
        type: String,
        default: null
    },
    LKID: {
        type: Number,
        default: null
    },
    referral: {
        type: String,
        default: null
    },
    referral_code: {
        type: String,
        required: true
    },
    referral_earning: {
        type: Number,
        default: 0
    },
    referral_wallet: {
        type: Number,
        default: 0

    },
    holder_name: {
        type: String,
        default: null
    },
    upi_id: {
        type: String,
        default: null
    },
    account_number: {
        type: String,
        default: null,
    },
    ifsc_code: {
        type: String,
        default: null,
    },
    wonAmount: {
        type: Number,
        default: 0
    },
    loseAmount: {
        type: Number,
        default: 0
    },
    totalDeposit: {
        type: Number,
        default: 0
    },
    totalWithdrawl: {
        type: Number,
        default: 0
    },  
    verified: {
        type: String,
        default: "unverified"
    },
    withdrawAmount: {
        type: Number,
        default: 0,
        min: 0
    },
    creatorWithdrawDeducted:{
        type: Number,
        default:null
    },
    acceptorWithdrawDeducted:{
        type: Number,
        default:null
    },
    withdraw_holdbalance: {
        type: Number,
        default: 0,
        min: 0
    },
    avatar: {
        type: String
    },
    Permissions: [{
        Permission: {
            type: String,
            default: null
        },
        Status: {
            type: Boolean,
            default: false
        }
    }],
    lastWitdrawl:{
        type:Number,
        default:null
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]

}, { timestamps: true })


userSchema.methods.genAuthToken = async function () {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, "soyal");
    user.tokens = [{ token }]
    await user.save()
    return token;
};

const User = mongoose.model("User", userSchema)

module.exports = User