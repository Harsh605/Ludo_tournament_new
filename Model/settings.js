const mongoose = require("mongoose")

const SiteSettingsSchema = new mongoose.Schema({
    WebTitle:{
        type: String,
        default: null
    },
    WebsiteName: {
        type: String,
        default: null
    },
    CompanyName: {
        type: String,
        default: null
    },
    CompanyMobile: {
        type: String,
        default: null
    },
    CompanyEmail: {
        type: String,
        default: null
    },
    CompanyWebsite: {
        type: String,
        default: null
    },
    CompanyAddress: {
        type: String,
        default: null
    },
    Logo: {
        type: String,
        default: null
    },
    SmallLogo: {
        type: String,
        default: null
    },
    LandingImage1: {
        type: String,
        default: null
    },
    LandingImage2: {
        type: String,
        default: null
    },
    LandingImage3: {
        type: String,
        default: null
    },
    LandingImage4: {
        type: String,
        default: null
    },
    LandingImage5: {
        type: String,
        default: null
    },
    LandingImage6: {
        type: String,
        default: null
    },
    LandingImage7: {
        type: String,
        default: null
    },
    LandingImage8: {
        type: String,
        default: null
    },
    isLandingImage1: {
        type: Boolean,
        default: false
    },
    isLandingImage2: {
        type: Boolean,
        default: false
    },
    isLandingImage3: {
        type: Boolean,
        default: false
    },
    isLandingImage4: {
        type: Boolean,
        default: false
    },
    isLandingImage5: {
        type: Boolean,
        default: false
    },
    isLandingImage6: {
        type: Boolean,
        default: false
    },
    isLandingImage7: {
        type: Boolean,
        default: false
    },
    isLandingImage8: {
        type: Boolean,
        default: false
    },
    version: {
        type: String,
        default: null
    },
    msg: {
        type: String,
        default: null
    },
    CompanyPercentage: {
        type: Number,
        default: 5
    },
    ReferencePercentage: {
        type: Number,
        default: 0
    },
    telegramLink: {
        type: String,
        default: null
    },
    commissionSettingOne:{
        type: Number,
        default: 5
    },
    commissionSettingTwo:{
        type: Number,
        default: 5
    },
    commissionSettingThree:{
        type: Number,
        default: 5
    },
    commissionSettingFour:{
        type: Number,
        default: 5
    },
    minimumGame:{
        type: Number,
        default: 5
    },
    maximumGame:{
        type: Number,
        default: 5
    },
    minimumWithdrawal:{
        type: Number,
        default: 5
    },
    maximumWithdrawal:{
        type: Number,
        default: 5
    },
    minimumDeposit:{
        type: Number,
        default: 100
    },
    maximumDeposit:{
        type: Number,
        default: 500
    },
    upiId1:{
        type: String,
        default: null
    },
    upiId2:{
        type: String,
        default: null
    },
    upiId3:{
        type: String,
        default: null
    },
    challengeMessage:{
        type: String,
        default: null
    },
    addCashMessage:{
        type: String,
        default: null
    },
    whatsapp:{
        type: String,
        default: null
    },
    qrCodeImage:{
        type: String,
        default: null
    },
    qrCode:{
        type: Boolean,
        default: true
    },
    wrongUpdatePenalty:{
        type: Number,
        default: true
    },
    noUpdatePenalty:{
        type: Number,
        default: true
    },
    withdrawTime:{
        type: Number,
        default: true
    },
    upiGatewayKey:{
        type: String,
    },
    paymentGateway:{
        type: Number,
        default: 0
    },


})

const SiteSettings = mongoose.model("SiteSettings",SiteSettingsSchema)
module.exports = SiteSettings