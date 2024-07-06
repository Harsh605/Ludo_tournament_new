const express=require("express");
const GatewaySettings=require("../Model/Gateway");
const router = express.Router()
const mongoose=require("mongoose");
const multer = require("multer")
const path = require("path");
const { findById, findOne } = require("../Model/settings");
const { send } = require("process");
const SiteSettings = require("../Model/settings");
const { default: axios } = require("axios");
const Auth = require("../Middleware/Auth");
const User = require("../Model/User");
const upiGatewayMyTransaction = require("../Model/UpiGatewayTransction");


router.post("/gatewaysettings",async(req, res) => {
    try{
    if(req.body.settingId){
        const updatesetting = await GatewaySettings.findById(req.body.settingId);
        updatesetting.RazorPayout=req.body.RazorPayout
        updatesetting.RazorDeposit=req.body.RazorDeposit
        updatesetting.RazorpayAuto= req.body.RazorpayAuto
        updatesetting.decentroPayout= req.body.decentroPayout
        updatesetting.decentroDeposit= req.body.decentroDeposit
        updatesetting.decentroAuto= req.body.decentroAuto
        updatesetting.RazorPayKey= req.body.RazorPayKey
        updatesetting.RazorPaySecretKey= req.body.RazorPaySecretKey
        updatesetting.AccountName= req.body.AccountName

        updatesetting.save();
        res.send({status:'success', data:updatesetting});
    }
    else{
        const data = new GatewaySettings({
            RazorPayout:req.body.RazorPayout,
            RazorDeposit:req.body.RazorDeposit,
            RazorpayAuto: req.body.RazorpayAuto,
            decentroPayout: req.body.decentroPayout,
            decentroDeposit: req.body.decentroDeposit,
            decentroAuto: req.body.decentroAuto,
            RazorPayKey: req.body.RazorPayKey,
            RazorPaySecretKey: req.body.RazorPaySecretKey,
            AccountName: req.body.AccountName
        });
        
        const val= await data.save();
        res.send({status:'success', data:val});
    }} catch (err) {
        res.send(err);
        res.send({status:'failed', data:err});
    }   
})


router.get('/gatewaysettings/data', async (req, res) => {
    try {
        const data = await GatewaySettings.findOne()
        res.send(data)
    } catch (e) {
        res.status(404).send()
    }
})
router.post(`/upiGatewayDoPayment`,async (req, res) => {
    try {
    const response = await axios.post(
      "https://api.ekqr.in/api/create_order",
      req.body
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }})

   const dateFormat = (date) => {
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date).replaceAll('/', '-');
  };

 const getUpiGatewayPaymentDetails = async (req, res, next) => {
    const { client_txn_id, txn_id } = req.query;
    console.log(req.query,"req.query")
    if (!client_txn_id && !txn_id) {
      return next(
        new Error("The user belonging to this token does no longer exist.", 401)
      );
    }
    req.client_txn_id = client_txn_id;
    req.txn_id = txn_id;
    req.txn_date = dateFormat(new Date());
    next();
  };
  router.get('/getUpiGatewayPaymentDetails', async (req, res, next) => {
    const { client_txn_id, txn_id } = req.query;
    console.log(req.query, "req.query");

    if (!client_txn_id || !txn_id) {
        return next(new Error("The user belonging to this token does no longer exist.", 401));
    }

    try {
        // Check if the transaction already exists
        const existingTransaction = await upiGatewayMyTransaction.findOne({
            client_txn_id: client_txn_id,
            txn_id: txn_id
        });

        if (existingTransaction) {
            const errorMessage = encodeURIComponent('Money Already Credited In Your Account.');
            const targetURL = `https://khelludokhel.info/AddChipsPage?error=${errorMessage}`;
            return res.redirect(302, targetURL);
        }

        txn_date = dateFormat(new Date());

        const data = await SiteSettings.findOne({}, 'upiGatewayKey'); // Only select the upiGatewayKey field
        console.log(data);

        if (!data) {
            throw new Error('Gateway key not found');
        }

        const gateWayKey = data.upiGatewayKey;
        const requestData = {
            key: gateWayKey,
            txn_id,
            client_txn_id,
            txn_date,
        };
        console.log(requestData);

        const response = await axios.post('https://api.ekqr.in/api/check_order_status', requestData);
        console.log(response.data);

        if (response.data.status) {
            const resData = response.data.data;
            const user = await User.findByIdAndUpdate(resData.udf1, {
                $inc: { Wallet_balance: Number(resData.amount),totalDeposit: Number(resData.amount) } // Increment wallet balance by the amount
            }, { new: true });

            await upiGatewayMyTransaction.create({
                User_id: resData.udf1,
                txn_id: resData.id,
                depositAmount: Number(resData.amount),
                oldAmount: Number(resData.udf2), // Assuming you want the old balance before increment
                client_txn_id: resData.client_txn_id,
                customer_name: resData.customer_name,
                customer_email: resData.customer_email,
                customer_mobile: resData.customer_mobile,
                upi_txn_id: resData.upi_txn_id,
                status: resData.status,
                ip: resData.ip,
                txnAt: resData.txnAt,
                createdAt: resData.createdAt,
            });

            const successMessage = encodeURIComponent('Transaction Successful, Amount has been added to your account!');
            const targetURL = `https://khelludokhel.info/AddChipsPage?message=${successMessage}`;
            return res.redirect(302, targetURL);
        } else {
            const errorMessage = encodeURIComponent('Transaction unsuccessful, please try again!');
            const targetURL = `https://khelludokhel.info/AddChipsPage?error=${errorMessage}`;
            return res.redirect(302, targetURL);
        }
    } catch (error) {
        console.error('Error processing payment details:', error);
        const errorMessage = encodeURIComponent('An error occurred while processing your request. Please try again later.');
        const targetURL = `https://khelludokhel.info/AddChipsPage?error=${errorMessage}`;
        return res.redirect(302, targetURL);
    }
});





module.exports =router;