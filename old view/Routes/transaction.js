const router = require("express").Router()

const Auth = require("../Middleware/Auth")
const Transaction = require("../Model/transaction")
const User = require("../Model/User")
const Temp = require('../Model/temp/temp')
// var nodeBase64 = require("nodejs-base64-converter");
// const sha256 = require("sha256");
const Game = require("../Model/Games");
const multer = require('multer');
const upload = multer();
const axios = require("axios").default;
const Razorpay = require('razorpay');
const jsSHA = require('jssha');
const SiteSettings = require("../Model/settings");
//use for razorpay service provider
let InProcessSubmit = false;
let InProcessDipositCallback = false;
let InProcessDipositWebhook = false;
//rzp_test_i0SlYyQSHbxcv1
//P7J4aOT676Px2CJq0eXLAs9K

const razorpayKey = 'rzp_test_TF4g8dFj5CY16x';
const razorpaySecretKey = 'ZiQZdaTqC6G0mOGkUfe927n9';

//const razorpayKey = 'rzp_live_kogCpL49QzgCBY';
//const razorpaySecretKey = 'dG5vhKMpKCZWe66FoQblUCwy';

router.post('/razorpaycheck/notify', async (req, res) => {
    //console.log('rezorpay webhook entity',req.body.payload.payment.entity);
    if (req.body.event) {

        const orderToken = req.body.payload.payment.entity.order_id;
        const orderStatus = req.body.payload.payment.entity.status;
        //console.log('orderToken',orderToken);
        //console.log('orderStatus',orderStatus);
        //console.log('req-body-event',req.body.event);

        const txn = await Transaction.findOne({ order_token: orderToken });
        const user = await User.findById(txn.User_id);
        //console.log('Razorpay txn',txn);
        if (req.body.event == 'payment.captured') {

            const txnCheck = await Transaction.findOne({ order_token: orderToken });

            if (txnCheck.status != 'PAID') {

                console.log('txn.status webhook11', txnCheck.status);

                txn.status = "PAID";
                txn.txn_msg = "Deposit Transaction is Successful";
                user.Wallet_balance += txn.amount;
                user.totalDeposit += txn.amount;

                txn.closing_balance = user.Wallet_balance;

                user.save();
                txn.save();
                //console.log('txnupdated2: Deposit Transaction is Successful');   
            } else {
                console.log('txn.status webhook21', txn.status);
            }

            res.status(200).json({ status: "ok", message: "response", responsecode: "200", data: null })
        }
        else if (req.body.event == 'payment.authorized') {
            const txnCheck2 = await Transaction.findOne({ order_token: orderToken });

            if (txnCheck2.status != 'PAID') {

                console.log('txn.status webhook12', txnCheck2.status);

                txn.status = "PAID";
                txn.txn_msg = "Deposit Transaction is Successful";
                user.Wallet_balance += txn.amount;
                user.totalDeposit += txn.amount;

                txn.closing_balance = user.Wallet_balance;

                user.save();
                txn.save();
                //console.log('txnupdated2: Deposit Transaction is Successful');   
            } else {
                console.log('txn.status webhook22', txn.status);
            }

            res.status(200).json({ status: "ok", message: "response", responsecode: "200", data: null })
        } else if (req.body.event == 'order.paid') {

            const txnCheck3 = await Transaction.findOne({ order_token: orderToken });

            if (txnCheck3.status != 'PAID') {

                console.log('txn.status webhook13', txnCheck2.status);

                txn.status = "PAID";
                txn.txn_msg = "Deposit Transaction is Successful";
                user.Wallet_balance += txn.amount;
                user.totalDeposit += txn.amount;

                txn.closing_balance = user.Wallet_balance;

                user.save();
                txn.save();
                //console.log('txnupdated2: Deposit Transaction is Successful');   
            } else {
                console.log('txn.status webhook23', txn.status);
            }

            res.status(200).json({ status: "ok", message: "response", responsecode: "200", data: null })
        }

        if (req.body.event == 'payment.failed') {

            if (txn.status != 'PAID') {
                txn.status = "FAILED";
                txn.txn_msg = "Transaction failed!";

                user.save();
                txn.save();
                //console.log('txnupdated2');
            }
            res.status(200).json({ status: "ok", message: "response", responsecode: "200", data: null })
        }

    } else {
        res.status(200).json({ status: "ok", message: "response fail", responsecode: "200", data: null })
    }
});

router.post('/razorpaycheck/response', Auth, async (req, res) => {


    const orderID = req.body.order_id;
    const orderToken = req.body.order_token;
    const orderStatus = req.body.order_status;
    const rpPaymentId = req.body.paymentId;
    const txn = await Transaction.findById(orderID);
    const user = await User.findById(txn.User_id)
    //console.log('orderID',orderID);
    //console.log('order_token',orderToken);

    //&& txn.status != "FAILED"
    if (txn.order_id === orderID && txn.order_token === orderToken && txn.status != 'PAID') {
        try {

            var instance = new Razorpay({ key_id: razorpayKey, key_secret: razorpaySecretKey })
            instance.orders.fetchPayments(orderToken, async function (err, order) {
                if (err) {
                    res.send({
                        status: 500,
                        message: "Something Went Wrong noti",
                    });
                }
                //captured
                console.log('paycap', order.items.length);
                if (order.items.length > 0) {
                    for (var i = 0; i < order.items.length; i++) {
                        console.log(order.items[i])
                        if (order.items[i].status == 'captured' && txn.status != 'PAID') {
                            txn.status = "PAID";
                            txn.txn_msg = "Deposit Transaction is Successfully Done";
                            user.Wallet_balance += txn.amount;
                            user.totalDeposit += txn.amount;

                            txn.closing_balance = user.Wallet_balance;
                            console.log('txnupdated: Deposit Transaction is Successfully Done');
                            user.save();
                            txn.save();
                        } else if (order.items[i].status == 'failed') {
                            txn.status = "FAILED";
                            txn.txn_msg = order.items[i].error_description;

                            user.save();
                            txn.save();
                        }

                    }
                    res.send(txn);
                } else {
                    txn.status = "FAILED";
                    txn.txn_msg = "Transaction failed!";

                    user.save();
                    txn.save();
                    res.send(txn);
                }
            });
        } catch (err) {
            //console.log('pay captur er',err);
            res.send(txn);
        }

    } else {
        res.send(txn);
    }
});


router.post('/razorpaydesposit/response', Auth, async (req, res) => {


    const orderID = req.body.order_id;
    const orderToken = req.body.order_token;
    const orderStatus = req.body.order_status;
    const rpPaymentId = req.body.paymentId;
    const txn = await Transaction.findById(orderID);
    const user = await User.findById(txn.User_id)
    //console.log(orderID);
    //&& txn.status != "FAILED"

    if (txn.order_id === orderID && txn.order_token === orderToken && txn.status != 'PAID') {
        try {
            const options = {
                method: 'POST',
                url: `https://${razorpayKey}:${razorpaySecretKey}@api.razorpay.com/v1/payments/${rpPaymentId}/capture`,
                form: {
                    amount: txn.amount * 100, // amount == Rs 10 // Same As Order amount
                    currency: "INR",
                }
            };
            axios.request(options).then(function (response) {
                console.log('payment capture', response);

            })
                .catch(function (error) {
                    console.error('pay captur error1');
                });
        } catch (err) {
            console.log('pay captur error2');
        }
        if (InProcessDipositCallback == false) {
            InProcessDipositCallback = true;
            if (orderStatus === 'SUCCESS' && txn.status != 'PAID') {
                console.log('InProcessDipositCallback2', txn.status)
                txn.status = "PAID";
                txn.txn_msg = "Deposit Transaction is Successfully Completed";
                user.Wallet_balance += txn.amount;
                user.totalDeposit += txn.amount;

                txn.closing_balance = user.Wallet_balance;

            } else {
                txn.status = "FAILED";
                txn.txn_msg = "Transaction failed!";
            }
            user.save();
            txn.save();
            InProcessDipositCallback = false;
            res.send(txn);
        } else {
            InProcessDipositCallback = false;
        }
    } else {
        res.send(txn);
    }
})

router.post("/user/razorpay_order", Auth, async (req, res) => {
    const txn = new Transaction({ amount: req.body.amount, User_id: req.user._id, Req_type: 'deposit' });

    const user = await User.findById(txn.User_id)
    var instance = new Razorpay({ key_id: razorpayKey, key_secret: razorpaySecretKey })

    var clientIp = req.headers['x-real-ip'];
    var clientForwardedIp = req.headers['x-forwarded-for'];
    var clientRemoteIp = req.headers['remote-host'];
    try {
        const options = {
            amount: txn.amount * 100, // amount == Rs 10
            currency: "INR",
            receipt: txn._id.toString(),
            payment_capture: 1,
        };
        instance.orders.create(options, async function (err, order) {
            if (err) {
                res.send({
                    status: 500,
                    message: "Something Went Wrong noti",
                });
            }
            txn.status = "Pending";
            txn.payment_gatway = req.body.payment_gatway;
            txn.order_id = txn._id;
            txn.order_token = order.id;

            txn.client_ip = clientIp;
            txn.client_forwarded_ip = clientForwardedIp;
            txn.client_remote_ip = clientRemoteIp;

            txn.save();
            res.send({ orderdata: order, txnID: txn._id });

        });
    } catch (err) {
        res.send({
            status: 500,
            message: "Something Went Wrong",
        });
    }

})


router.post('/phonepev1/accept', Auth, async (req, res) => {

    const txn = new Transaction({ amount: req.query.amount, User_id: req.user.id, Req_type: 'deposit' });
    const user = await User.findById(txn.User_id)

    var payload = {
        merchantId: "LUDOKHELOONLINE",
        merchantTransactionId: txn._id,
        merchantUserId: "95259772-df1d-478b-8a42-8c22cb171ec8",
        amount: txn.amount * 100,
        redirectUrl: "https://www.ludo-khelo.com/Addcase",
        redirectMode: "GET",
        callbackUrl: "https://api.ludo-khelo.com/phonepev1/status",
        mobileNumber: "8118823915",
        paymentInstrument: {
            type: "PAY_PAGE",
        },
    };
    var payload_base = nodeBase64.encode(JSON.stringify(payload));
    var payload_base = JSON.stringify(payload);
    var serverkey = "YOUR SERVER KEY";
    // var sha = sha256(payload_base + "/pg/v1/pay" + "95259772-df1d-478b-8a42-8c22cb171ec8");
    var sha = 123;
    console.log(sha);
    var data = JSON.stringify({
        request: payload_base,
    });

    var config = {
        method: "post",
        url: "https://api.phonepe.com/apis/hermes/pg/v1/pay",
        headers: {
            "X-VERIFY": sha + "###" + 1,
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        data: data,
    };

    axios(config)
        .then(function (response) {
            console.log("QQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQ", JSON.stringify(response.data.data.merchantTransactionId));
            txn.status = "Pending";
            txn.payment_gatway = req.body.payment_gatway;
            txn.order_id = response.data.data.merchantTransactionId;
            txn.order_token = "asdfg";

            txn.save();

            res.send(JSON.stringify(response.data));
        })
        .catch(function (error) {
            console.log(error);
        });
});

router.post('/phonepev1/status', async (req, res) => {

    const resx = JSON.parse(nodeBase64.decode(req.body.response))
    console.log("TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT")
    console.log(resx)

    const orderID = resx.data.merchantTransactionId;

    const txn = await Transaction.findById(orderID);

    if (txn.status != "PAID" && txn.status != "FAILED") {
        if (resx.success == true) {
            txn.status = 'PAID';
            const user = await User.findById(txn.User_id)
            user.Wallet_balance += txn.amount;
            user.totalDeposit += txn.amount;
            await user.save();
            txn.closing_balance = user.Wallet_balance;
            txn.txn_msg = 'UPI Transaction is Successful';
            await txn.save();
        }
        else if (resx.success == false) {
            txn.status = 'FAILED';
            txn.txn_msg = resx.message;
            await txn.save();
        }
        else {
            txn.status = 'Pending';
            txn.txn_msg = "Transaction Processing";
            await txn.save();
        }
    }
    res.status(200).json({ status: "ok", message: "response", responsecode: "200" })
});










//use for upigatway service provider
router.post("/user/depositeupi", Auth, async (req, res) => {
    const txn = new Transaction({ amount: req.body.amount, User_id: req.user._id, Req_type: 'deposit' });
    const user = await User.findById(txn.User_id)
    await axios.post('https://merchant.upigateway.com/api/create_order',
        {
            "key": "62c2bd25-4829-46f4-a411-7373d61a4e05",
            "client_txn_id": txn._id,
            "amount": txn.amount.toString(),
            "p_info": "Add Wallet",
            "customer_name": "TP ludo", //req.body.account_name,
            "customer_email": "tpludo@gmail.com", //req.body.account_mail_id,
            "customer_mobile": user.Phone.toString(),
            "redirect_url": "https://tpludo.com/return",
            "udf1": "user desposit"
        },
        {
            headers: {
                'Content-Type': 'application/json'
            }
        }
    ).then((result) => {
        //console.log(result)
        if (result.data.status) {

            txn.status = "Pending";
            txn.payment_gatway = req.body.payment_gatway;
            txn.order_id = txn._id;
            txn.order_token = result.data.data.order_id;
            res.send({ data: result.data, txnID: txn._id });
            txn.save();
        } else {
            res.send({ data: result.data });
        }
    }).catch((e) => {
        console.log(e)
    })

})

//use for upigatway service provider response
router.post('/depositupipay/response', Auth, async (req, res) => {
    //console.log(req.body);
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();
    //today = dd + '-' + mm + '-' + yyyy;
    if (req.body.pay_date) {
        today = req.body.pay_date;
    } else {
        today = dd + '-' + mm + '-' + yyyy;
    }
    //console.log(today)

    const orderID = req.body.order_id;
    const orderToken = req.body.order_token;
    const txn = await Transaction.findById(orderID);
    const user = await User.findById(txn.User_id)
    //&& txn.status != "FAILED"
    if (txn.order_id === orderID && txn.order_token === orderToken && txn.status != 'PAID') {
        await axios.post('https://merchant.upigateway.com/api/check_order_status',
            {
                "key": "62c2bd25-4829-46f4-a411-7373d61a4e05",
                "client_txn_id": orderID,
                "txn_date": today
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        ).then((response) => {
            //console.log(response)
            if (response.data.data.status === 'success') {
                txn.status = "PAID";
                txn.txn_msg = "Transaction is Successful";
                user.Wallet_balance += txn.amount;
                user.totalDeposit += txn.amount;

                txn.closing_balance = user.Wallet_balance;
            } else {
                txn.status = "FAILED";
                txn.txn_msg = response.data.data.remark;
            }
            user.save();
            txn.save();
            res.send(txn);
        }).catch((e) => {
            console.log(e)
        })

    } else {
        res.send(txn);
    }
})



router.post('/upideposit/status', async (req, res) => {
    //console.log('upigateway notify',req.body);

    const orderID = req.body.client_txn_id;
    const txn = await Transaction.findById(orderID);
    if (txn.status != "PAID" && txn.status != "FAILED") {
        if (req.body.status == "success") {
            txn.status = 'PAID';
            const user = await User.findById(txn.User_id)
            user.Wallet_balance += txn.amount;
            user.totalDeposit += txn.amount;
            await user.save();
            txn.closing_balance = user.Wallet_balance;
            txn.txn_msg = 'UPI Transaction is Successful';
            await txn.save();
        }
        else if (req.body.status == "failure") {
            txn.status = 'FAILED';
            txn.txn_msg = req.body.remark;
            await txn.save();
        }
        else {
            txn.status = 'Pending';
            txn.txn_msg = "Transaction Processing";
            await txn.save();
        }
    }
    res.status(200).json({ status: "ok", message: "response", responsecode: "200" })
})


router.post('/checkout/deposite/txn', Auth, async (req, res) => {
    try {
        const txn = await Transaction.findById(req.body.txnID);
        if (txn.status != 'Pending') {
            res.send({ txnStatus: txn.status, msg: txn.txn_msg })
        }
        else {
            res.send({ txnStatus: 'pending' })
        }
    } catch (error) {
        console.log(error)
    }
})


router.get("/deposit/success", async (req, res) => {
    try {
        const admin = await Transaction.find({ status: "success" }).countDocuments()

        res.status(200).send(admin.toString()).sort({ createdAt: -1 })

    } catch (e) {
        res.status(400).send(e)
    }
})

router.get("/deposit/pending", async (req, res) => {
    try {
        const admin = await Transaction.find({ status: "Pending" }).countDocuments()

        res.status(200).send(admin.toString()).sort({ createdAt: -1 })

    } catch (e) {
        res.status(400).send(e)
    }
})
router.get("/deposit/rejected", async (req, res) => {
    try {
        const admin = await Transaction.find({ status: "rejected" }).countDocuments().sort({ createdAt: -1 })

        res.status(200).send(admin.toString())

    } catch (e) {
        res.status(400).send(e)
    }
})

router.get("/txn/deposit/all", Auth, async (req, res) => {
    const searchq = req.query._q;
    const searchtype = req.query._stype;
    const searchbystatus = req.query._status;

    const PAGE_SIZE = req.query._limit;
    let page = (req.query.page == 0) ? 0 : parseInt(req.query.page - 1);
    try {

        let query = {};
        let total;
        let admin;
        if (searchq != 0 && searchtype != 0 && searchbystatus == 0 && searchtype != '_id') {
            page = parseInt("0");
            query[searchtype] = (searchtype === 'Phone' || searchtype === '_id') ? searchq : new RegExp('.*' + searchq + '.*')
            let userData = await User.findOne(query).select('_id').where("user_type").ne("Admin");

            myObjectId = userData._id;
            myObjectIdString = myObjectId.toString()

            total = await Transaction.countDocuments({ Req_type: "deposit", User_id: myObjectIdString });
            admin = await Transaction.find({ Req_type: "deposit", User_id: myObjectIdString }).populate("User_id").sort({ createdAt: -1 });

        } else if (searchbystatus != 0 && searchq == 0 && searchtype == 0) {
            total = await Transaction.countDocuments({ Req_type: "deposit", status: searchbystatus });
            admin = await Transaction.find({ Req_type: "deposit", status: searchbystatus }).populate("User_id").sort({ createdAt: -1 }).limit(PAGE_SIZE).skip(PAGE_SIZE * page);
        }
        else if (searchtype === '_id') {
            query[searchtype] = (searchtype === '_id') ? searchq : new RegExp('.*' + searchq + '.*')
            total = await Transaction.countDocuments(query);
            admin = await Transaction.find(query).populate("User_id").sort({ createdAt: -1 }).limit(PAGE_SIZE).skip(PAGE_SIZE * page);
        }
        else {
            total = await Transaction.countDocuments({ Req_type: "deposit" });
            admin = await Transaction.find({ Req_type: "deposit" }).populate("User_id").sort({ createdAt: -1 }).limit(PAGE_SIZE).skip(PAGE_SIZE * page);
        }

        //const total = await Transaction.countDocuments({$and: [{ Req_type: "deposit" }]});
        //const admin = await Transaction.find({$and: [{ Req_type: "deposit" }]}).populate("User_id").sort({ createdAt: -1 }).limit(PAGE_SIZE).skip(PAGE_SIZE * page)

        res.status(200).send({ totalPages: Math.ceil(total / PAGE_SIZE), admin })

    } catch (e) {
        res.status(400).send(e)
    }
})

//bonusbyadmin
router.get("/txn/bonusbyadmin/all", Auth, async (req, res) => {
    const PAGE_SIZE = req.query._limit;
    let page = (req.query.page == 0) ? 0 : parseInt(req.query.page - 1);
    try {
        const total = await Transaction.countDocuments({ $and: [{ Req_type: "bonus" }] });
        const admin = await Transaction.find({ $and: [{ Req_type: "bonus" }] }).populate("User_id").populate("action_by").sort({ createdAt: -1 }).limit(PAGE_SIZE).skip(PAGE_SIZE * page)

        res.status(200).send({ totalPages: Math.ceil(total / PAGE_SIZE), admin })

    } catch (e) {
        res.status(400).send(e)
    }
})

router.get("/txn_history/user/:id", Auth, async (req, res) => {
    try {
        const admin = await Transaction.find({
            $and: [{


                User_id: req.params.id, Req_type: "deposit"
            }]
        }).populate("User_id").sort({ createdAt: -1 });

        res.status(200).send(admin)

    } catch (e) {
        res.status(400).send(e)
    }
})

router.get("/txnwith_history/user/:id", Auth, async (req, res) => {
    try {
        const admin = await Transaction.find({


            $or: [{ User_id: req.params.id, Req_type: "withdraw" }]
        }).populate("User_id").sort({ createdAt: -1 });

        res.status(200).send(admin)

    } catch (e) {
        res.status(400).send(e)
    }
})

router.get("/txn/withdraw/all", Auth, async (req, res) => {
    const searchq = req.query._q;
    const searchtype = req.query._stype;
    const searchbystatus = req.query._status;

    const PAGE_SIZE = req.query._limit;
    let page = (req.query.page == 0) ? 0 : parseInt(req.query.page - 1);
    try {

        let query = {};
        let total;
        let data;
        if (searchq != 0 && searchtype != 0 && searchbystatus == 0) {
            page = parseInt("0");
            query[searchtype] = (searchtype === 'Phone' || searchtype === '_id') ? searchq : new RegExp('.*' + searchq + '.*')
            let admin = await User.findOne(query).select('_id').where("user_type").ne("Admin");

            myObjectId = admin._id;
            myObjectIdString = myObjectId.toString()

            total = await Transaction.countDocuments({ Req_type: "withdraw", User_id: myObjectIdString });
            data = await Transaction.find({ Req_type: "withdraw", User_id: myObjectIdString }).populate("User_id").sort({ createdAt: -1 });

        } else if (searchbystatus != 0 && searchq == 0 && searchtype == 0) {
            total = await Transaction.countDocuments({ Req_type: "withdraw", status: searchbystatus });
            data = await Transaction.find({ Req_type: "withdraw", status: searchbystatus }).populate("User_id").sort({ createdAt: -1 }).limit(PAGE_SIZE).skip(PAGE_SIZE * page);
        }
        else {
            total = await Transaction.countDocuments({ Req_type: "withdraw" });
            data = await Transaction.find({ Req_type: "withdraw" }).populate("User_id").sort({ createdAt: -1 }).limit(PAGE_SIZE).skip(PAGE_SIZE * page);
        }


        //res.status(200).send(data)

        res.status(200).send({ totalPages: Math.ceil(total / PAGE_SIZE), data })
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get("/txn/withdraw/all/reject", Auth, async (req, res) => {
    try {
        const data = await Transaction.find({
            Req_type: "withdraw"
        }).populate("User_id").sort({ createdAt: -1 })
        res.status(200).send(data)
    } catch (e) {
        res.status(400).send(e)
    }
})



//payout manual through upi
router.post("/withdraw/payoutmanualupi", Auth, async (req, res) => {

    const { amount, type, payment_gatway } = req.body
    const userID = req.user.id

    try {
        const user1 = await User.findById(userID);
        const lasttrans = await Transaction.findOne({ 'User_id': req.user.id }).sort({ _id: -1 });
        console.log("HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH", req.user.id)

        console.log('userlasttxnstsauto', lasttrans.status);
        console.log('userlasttxntime-auto', user1.lastWitdrawl);

        let currentTime = Date.now();
        let pendingGame = await Game.find(
            {
                $or: [
                    { $and: [{ Status: "new" }, { Created_by: userID }] },
                    { $and: [{ Status: "new" }, { Accepetd_By: userID }] },
                    { $and: [{ Status: "requested" }, { Created_by: userID }] },
                    { $and: [{ Status: "requested" }, { Accepetd_By: userID }] },
                ],

            }
        )
        let calculatedWallet = ((user1.wonAmount - user1.loseAmount) + user1.totalDeposit + user1.referral_earning + user1.hold_balance + user1.totalBonus) - (user1.totalWithdrawl + user1.referral_wallet + user1.totalPenalty);
        if (user1.Wallet_balance == calculatedWallet) {
            console.log("UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUu")

            if (pendingGame.length == 0) {
                if (((parseInt(user1.lastWitdrawl) + 3600000) < currentTime && lasttrans.status == 'SUCCESS') || (user1.lastWitdrawl == null) || (!lasttrans || lasttrans.status != 'SUCCESS')) {
                    if (amount <= 10000) {
                        if (user1.withdraw_holdbalance == 0) {

                            if (amount <= user1.Wallet_balance && amount <= user1.withdrawAmount) {
                                const txn1 = new Transaction();
                                txn1.amount = amount;
                                txn1.User_id = user1._id;
                                txn1.Req_type = 'withdraw';
                                txn1.Withdraw_type = "UPI";
                                txn1.payment_gatway = payment_gatway;
                                txn1.status = 'Processing';

                                user1.Wallet_balance -= amount;
                                user1.withdrawAmount -= amount;
                                user1.withdraw_holdbalance += amount;
                                user1.lastWitdrawl = Date.now();

                                txn1.closing_balance = user1.Wallet_balance;

                                user1.save();
                                txn1.save();

                                return res.send(txn1);
                            }
                            else {
                                res.status(200).send({ message: 'Amount must be less than and equal to Wallet amount', subCode: 999 });
                            }
                        }
                        else {
                            res.status(200).send({ message: 'Your previous request already in process', subCode: 999 });
                        }
                    } else {
                        res.status(200).send({ message: 'UPI Withdrawal limit is Rs.10000, You can use withdraw through bank', subCode: 999 });
                    }
                }
                else {
                    res.status(200).send({ message: 'You can\'t Withdrawal for 1 hour since the last withdrawal.', subCode: 999 });
                }
            }
            else {
                res.status(200).send({ message: 'You are enrolled in game.', subCode: 999 });
            }
        }
        else {
            res.status(200).send({ message: 'Withdrawal is failed please contact to admin.', subCode: 999 });
        }
    }
    catch (e) {
        console.log(")))))))))))))))))))))))))))))))))))))))))))))))))))))000000000000000000000000000", e);
        res.status(200).send({ message: 'Withdrawal is failed, Due to technical issue.', subCode: 999 });
    }
})


router.get("/manual/payoutstatus/:id", async (req, res) => {
    try {
        const txn1 = await Transaction.findById(req.params.id)
        //console.log(txn1);
        res.send(txn1);
    } catch (e) {
        res.status(400).send(e)
    }
})


const cfSdk = require('cashfree-sdk');
const { findById } = require("../Model/User")


const config = {
    Payouts: {
        ClientID: "CF217991CB3DEFUD94MM84223P3G",
        ClientSecret: "4fdeb33d0a4cecc3ad2975e83fe026f8377d487e",
        ENV: "PRODUCTION",
    }
};

const handleResponse = (response) => {
    if (response.status === "ERROR") {
        throw { name: "handle response error", message: "error returned" };
    }
}

const { Payouts } = cfSdk;
const { Beneficiary, Transfers } = Payouts;



router.post("/withdraw/request", Auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const setting = await SiteSettings.findOne();
        const lasttrans = await Transaction.findOne({ 'User_id': req.user.id }).sort({ _id: -1 });
        console.log("_________________________===========================================-----------------------", req.user.id)
        console.log('userlasttxntime', user.lastWitdrawl);

        let currentTime = Date.now();
        console.log('userCurrenttime', currentTime);

        let pendingGame = await Game.find(
            {
                $or: [
                    { $and: [{ Status: "new" }, { Created_by: req.user.id }] },
                    { $and: [{ Status: "new" }, { Accepetd_By: req.user.id }] },
                    { $and: [{ Status: "requested" }, { Created_by: req.user.id }] },
                    { $and: [{ Status: "requested" }, { Accepetd_By: req.user.id }] },
                ],

            }
        )
        if (pendingGame.length == 0) {
            if (((parseInt(user.lastWitdrawl) + ((setting?.withdrawTime || 1) * 60 * 1000)) < currentTime && lasttrans.status == 'SUCCESS') || (user.lastWitdrawl == null) || (!lasttrans || lasttrans.status != 'SUCCESS')) {
                if (req.body.amount > setting.maximumWithdrawal)
                    return res.send({ "msg": `Withdrawal amount should be less or equal to ${setting.maximumWithdrawal} Rupees`, "success": false })

                if (req.body.amount >= setting.minimumWithdrawal) {
                    if (user.withdraw_holdbalance == 0) {
                        if (user.Wallet_balance >= req.body.amount && user.withdrawAmount >= req.body.amount) {
                            user.Wallet_balance -= req.body.amount;
                            user.withdrawAmount -= req.body.amount;
                            user.withdraw_holdbalance += req.body.amount;
                            user.lastWitdrawl = Date.now();
                            user.save();

                            var clientIp = req.headers['x-real-ip'];
                            var clientForwardedIp = req.headers['x-forwarded-for'];
                            var clientRemoteIp = req.headers['remote-host'];

                            const txn = new Transaction();
                            txn.amount = req.body.amount;
                            txn.User_id = user._id;
                            txn.Req_type = 'withdraw';
                            txn.Withdraw_type = req.body.type;
                            txn.payment_gatway = (req.body.payment_gatway) ? req.body.payment_gatway : '';
                            txn.closing_balance = user.Wallet_balance;
                            txn.status = 'Pending';
                            txn.client_ip = clientIp;
                            txn.client_forwarded_ip = clientForwardedIp;
                            txn.client_remote_ip = clientRemoteIp;
                            txn.save();

                            const withdraw = new Temp();
                            withdraw.Req_type = "withdraw";
                            withdraw.type = req.body.type;
                            withdraw.user = user._id;
                            withdraw.status = "Pending";
                            withdraw.closing_balance = user.Wallet_balance;
                            withdraw.amount = req.body.amount;
                            withdraw.txn_id = txn._id;
                            withdraw.save();

                            res.send({ "msg": "Your withdraw request submited successfully.", "success": true })
                        }
                        else {
                            res.send({ "msg": "You have not sufficient balance for withdrawal.", "success": false })
                        }
                    }
                    else {
                        res.send({ "msg": "Your previous request already in process", "success": false })
                        //Your previous request already in process
                    }
                }
                else {
                    res.send({ "msg": `Withdrawal amount should be greater or equal to ${setting.minimumWithdrawal} Rupees`, "success": false })
                    //Withdrawal amount should be greater or equal to 95 Rupees.
                }
            }
            else {
                res.status(200).send({ "msg": `You can\'t withdrawal for ${setting?.withdrawTime || 1} hour since the last withdrawal.`, "success": false, subCode: 999 });
            }
        }
        else {
            res.status(200).send({ "msg": 'You are enrolled in game.', "success": false, subCode: 999 });
        }

    } catch (error) {
        console.log(error)
        res.status(400).send(error);
    }
})

//for cashfree admin approval
router.post("/withdraw/bank/adminmanual", Auth, async (req, res) => {

    const { amount, type, userID, txnID, reqID } = req.body
    try {
        const user = await User.findById(userID);
        if (user.withdraw_holdbalance > 0) {

            const txn = await Transaction.findById(txnID);

            const transfer = {
                beneId: user._id,
                transferId: txn._id,
                amount: amount,
                transferMode: type
            };

            (
                async () => {
                    Payouts.Init(config.Payouts);
                    //Get Beneficiary details
                    try {
                        const response = await Beneficiary.GetDetails({
                            "beneId": user._id,
                        });
                        if (response.status === 'ERROR' && response.subCode === '404' && response.message === 'Beneficiary does not exist') {
                            res.status(200).send(response);

                        }
                        else {
                            // further process for payment transfer
                            try {
                                const response = await Transfers.RequestTransfer(transfer);

                                res.status(200).send(response);
                                handleResponse(response);
                            }
                            catch (err) {

                                console.log(err);
                                return;
                            }
                            //Get transfer status
                            try {
                                const response = await Transfers.GetTransferStatus({
                                    "transferId": transfer.transferId,
                                });
                                if (response.data.transfer.status === 'SUCCESS') {
                                    txn.referenceId = response.data.transfer.referenceId;
                                    txn.status = response.data.transfer.status;
                                    user.totalWithdrawl += txn.amount;
                                    user.withdraw_holdbalance -= txn.amount;
                                    user.lastWitdrawl = Date.now();
                                    await user.save();
                                    await txn.save()


                                    const withdraw = await Temp.findById(reqID);
                                    withdraw.status = response.data.transfer.status;
                                    withdraw.save();
                                }
                                handleResponse(response);
                            }
                            catch (err) {
                                console.log("err caught in getting transfer status");
                                console.log(err);
                                return;
                            }
                        }
                    }
                    catch (err) {
                        console.log("err caught in getting beneficiary details");
                        console.log(err);
                        return;
                    }

                }
            )();

        }
        else {
            res.status(200).send({ message: 'Invalid Request', subCode: 999 });
        }
    }
    catch (e) {
        res.send(e)
        console.log(e);
    }
})

//for razorpay admin payout approval
router.post("/withdraw/razorpay/adminmanual", Auth, async (req, res) => {

    const { amount, type, userID, txnID, reqID } = req.body

    var clientIp = req.headers['x-real-ip'];
    var clientForwardedIp = req.headers['x-forwarded-for'];
    var clientRemoteIp = req.headers['remote-host'];

    console.log('admin rzp txnid');
    console.log(reqID);

    try {
        const user = await User.findById(userID);
        if (user.withdraw_holdbalance > 0 && type == 'upi') {

            const txn = await Transaction.findById(txnID);
            const withdraw = await Temp.findById(reqID);

            if (InProcessSubmit == false) {
                //res.status(200).send({ message: 'Payout Request already processed', subCode: 999 });
                InProcessSubmit = true;
                //console.log(withdraw);
                if (txn.status === 'SUCCESS' || txn.status === 'FAILED') {
                    console.log('Payout Request already processed1');
                    InProcessSubmit = false;
                    res.status(200).send({ message: 'Payout Request already processed1', subCode: 999 });
                } else {
                    //rzp_test_i0SlYyQSHbxcv1
                    //P7J4aOT676Px2CJq0eXLAs9K

                    var username = razorpayKey;
                    var password = razorpaySecretKey;
                    (
                        async () => {
                            const axios = require('axios').default;
                            const options = {
                                method: 'POST',
                                url: 'https://api.razorpay.com/v1/payouts',
                                auth: {
                                    username: username,
                                    password: password
                                },
                                headers: {
                                    'content-type': 'application/json'
                                },
                                data:
                                {
                                    "account_number": "4564560186107152",
                                    "amount": amount * 100,
                                    "currency": "INR",
                                    "mode": "UPI",
                                    "purpose": "payout",
                                    "fund_account": {
                                        "account_type": "vpa",
                                        "vpa": {
                                            "address": user.upi_id
                                        },
                                        "contact": {
                                            "name": user.holder_name.toString(),
                                            "email": (user.email) ? user.email.toString() : "",
                                            "contact": (user.Phone) ? user.Phone.toString() : "",
                                            "type": "self",
                                            "reference_id": user._id.toString(),
                                        }
                                    },
                                    "queue_if_low_balance": true,
                                    "reference_id": txn._id,
                                },
                            };

                            axios.request(options)
                                .then(function (response) {
                                    console.log('admin payout request response');
                                    console.log(response.data);

                                    if (response.data.status === 'processed') {
                                        txn.referenceId = response.data.id;
                                        txn.status = 'SUCCESS';
                                        txn.action_by = req.user.id;

                                        txn.client_ip = clientIp;
                                        txn.client_forwarded_ip = clientForwardedIp;
                                        txn.client_remote_ip = clientRemoteIp;

                                        if (user.withdraw_holdbalance == txn.amount) {
                                            user.totalWithdrawl += txn.amount;
                                            user.withdraw_holdbalance -= txn.amount;
                                        }

                                        user.save();
                                        txn.save()

                                        withdraw.closing_balance = withdraw.closing_balance - withdraw.amount;
                                        withdraw.status = 'SUCCESS';
                                        withdraw.save();

                                        InProcessSubmit = false;

                                        res.status(200).send({ message: 'Your withdrawal request successfully completed', subCode: 200 });

                                    } else if (response.data.status === 'pending' || response.data.status === 'queued' || response.data.status === 'processing') {

                                        txn.referenceId = response.data.id;
                                        txn.status = 'pending';
                                        txn.action_by = req.user.id;

                                        txn.client_ip = clientIp;
                                        txn.client_forwarded_ip = clientForwardedIp;
                                        txn.client_remote_ip = clientRemoteIp;

                                        txn.save();
                                        user.save();

                                        //withdraw.closing_balance = withdraw.closing_balance - withdraw.amount;
                                        withdraw.status = 'Proccessing';
                                        withdraw.save();

                                        InProcessSubmit = false;

                                        res.status(200).send({ message: 'Your withdrawal request in proccessing', subCode: 200 });

                                    } else if (response.data.status === 'rejected' || response.data.status === 'cancelled') {
                                        txn.referenceId = response.data.id;
                                        txn.status = 'FAILED';
                                        txn.action_by = req.user.id;
                                        txn.txn_msg = "issuer bank or payment service provider declined the transaction";

                                        txn.client_ip = clientIp;
                                        txn.client_forwarded_ip = clientForwardedIp;
                                        txn.client_remote_ip = clientRemoteIp;

                                        if (user.withdraw_holdbalance == txn.amount) {
                                            user.Wallet_balance += txn.amount;
                                            user.withdrawAmount += txn.amount;
                                            user.withdraw_holdbalance -= txn.amount;
                                        }
                                        user.save();
                                        txn.save();

                                        withdraw.closing_balance = withdraw.closing_balance + withdraw.amount;
                                        withdraw.status = 'FAILED';
                                        withdraw.save();

                                        InProcessSubmit = false;

                                        res.status(200).send({ message: 'Your withdrawal request failed', subCode: 200 });
                                    }
                                })
                                .catch(function (error) {
                                    console.error('admin auto payout response error');
                                    txn.status = 'FAILED';
                                    txn.action_by = req.user.id;
                                    txn.txn_msg = "Withdraw request failed due to technical issue, try after some time.";

                                    txn.client_ip = clientIp;
                                    txn.client_forwarded_ip = clientForwardedIp;
                                    txn.client_remote_ip = clientRemoteIp;

                                    if (user.withdraw_holdbalance == txn.amount) {
                                        user.Wallet_balance += txn.amount;
                                        user.withdrawAmount += txn.amount;
                                        user.withdraw_holdbalance -= txn.amount;
                                    }
                                    user.save();
                                    txn.save();

                                    withdraw.closing_balance = withdraw.closing_balance + withdraw.amount;
                                    withdraw.status = 'FAILED';
                                    withdraw.save();

                                    InProcessSubmit = false;

                                    res.status(200).send({ message: 'Withdraw request failed due to technical issue, try after some time.', subCode: 200 });

                                });
                        }
                    )();
                    user.save();
                    txn.save();

                }
            } else {
                console.log('Payout Request already processed2');
                InProcessSubmit = false;
                res.status(200).send({ message: 'Payout Request already processed2', subCode: 999 });
            }
        }
        else {
            InProcessSubmit = false;
            res.status(200).send({ message: 'Invalid Request', subCode: 999 });
        }
    }
    catch (e) {
        res.send(e)
        //console.log(e);
    }
})

//payout payout razorpay bank
router.post("/withdraw/payoutrazorpaybank", Auth, async (req, res) => {

    const { amount, type, payment_gatway } = req.body
    const userID = req.user.id

    var clientIp = req.headers['x-real-ip'];
    var clientForwardedIp = req.headers['x-forwarded-for'];
    var clientRemoteIp = req.headers['remote-host'];

    try {
        const user1 = await User.findById(userID);
        const lasttrans = await Transaction.findOne({ 'User_id': req.user.id }).sort({ _id: -1 });

        console.log('userlasttxnstsauto', lasttrans.status);
        console.log('userlasttxntime-auto', user1.lastWitdrawl);

        let currentTime = Date.now();
        let pendingGame = await Game.find(
            {
                $or: [
                    { $and: [{ Status: "new" }, { Created_by: userID }] },
                    { $and: [{ Status: "new" }, { Accepetd_By: userID }] },
                    { $and: [{ Status: "requested" }, { Created_by: userID }] },
                    { $and: [{ Status: "requested" }, { Accepetd_By: userID }] },
                ],

            }
        )
        let calculatedWallet = ((user1.wonAmount - user1.loseAmount) + user1.totalDeposit + user1.referral_earning + user1.hold_balance + user1.totalBonus) - (user1.totalWithdrawl + user1.referral_wallet + user1.totalPenalty);
        if (user1.Wallet_balance == calculatedWallet) {

            if (pendingGame.length == 0) {
                if (((parseInt(user1.lastWitdrawl) + 3600000) < currentTime && lasttrans.status == 'SUCCESS') || (user1.lastWitdrawl == null) || (!lasttrans || lasttrans.status != 'SUCCESS')) {
                    if (amount <= 10000) {
                        if (user1.withdraw_holdbalance == 0) {

                            if (amount <= user1.Wallet_balance && amount <= user1.withdrawAmount) {
                                const txn1 = new Transaction();
                                txn1.amount = amount;
                                txn1.User_id = user1._id;
                                txn1.Req_type = 'withdraw';
                                txn1.Withdraw_type = type;
                                txn1.payment_gatway = payment_gatway;

                                user1.Wallet_balance -= amount;
                                user1.withdrawAmount -= amount;
                                user1.withdraw_holdbalance += amount;
                                user1.lastWitdrawl = Date.now();
                                txn1.closing_balance = user1.Wallet_balance;

                                user1.save();
                                txn1.save();

                                const user = await User.findById(userID);
                                const txn = await Transaction.findById(txn1._id);

                                //console.log('razor-seco-txndata',txn);

                                var username = razorpayKey;
                                var password = razorpaySecretKey;
                                (
                                    async () => {
                                        const axios = require('axios').default;
                                        const options = {
                                            method: 'POST',
                                            url: 'https://api.razorpay.com/v1/payouts',
                                            auth: {
                                                username: username,
                                                password: password
                                            },
                                            headers: {
                                                'content-type': 'application/json'
                                            },
                                            data:
                                            {
                                                "account_number": "4564560186107152",
                                                "amount": amount * 100,
                                                "currency": "INR",
                                                "mode": "UPI",
                                                "purpose": "payout",
                                                "fund_account": {
                                                    "account_type": "vpa",
                                                    "vpa": {
                                                        "address": user.upi_id
                                                    },
                                                    "contact": {
                                                        "name": user.holder_name.toString(),
                                                        "email": (user.email) ? user.email.toString() : "",
                                                        "contact": (user.Phone) ? user.Phone.toString() : "",
                                                        "type": "self",
                                                        "reference_id": user._id.toString(),
                                                    }
                                                },
                                                "queue_if_low_balance": true,
                                                "reference_id": txn._id,
                                            },
                                        };

                                        axios.request(options)
                                            .then(function (response) {
                                                //console.log('USER auto payout response2');
                                                //console.log(response.data);

                                                txn.client_ip = clientIp;
                                                txn.client_forwarded_ip = clientForwardedIp;
                                                txn.client_remote_ip = clientRemoteIp;

                                                if (response.data.status === 'processed') {
                                                    txn.referenceId = response.data.id;
                                                    txn.status = 'SUCCESS';

                                                    if (user.withdraw_holdbalance == txn.amount) {
                                                        user.totalWithdrawl += txn.amount;
                                                        user.withdraw_holdbalance -= txn.amount;
                                                    }

                                                    user.save();
                                                    txn.save()

                                                    withdraw.closing_balance = withdraw.closing_balance - withdraw.amount;
                                                    withdraw.status = 'SUCCESS';
                                                    withdraw.save();

                                                    res.status(200).send({ message: 'Your withdrawal request successfully completed', subCode: 200 });

                                                } else if (response.data.status === 'pending' || response.data.status === 'queued' || response.data.status === 'processing') {

                                                    txn.referenceId = response.data.id;
                                                    txn.status = 'pending';
                                                    txn.save();
                                                    user.save();

                                                    res.status(200).send({ message: 'Your withdrawal request in proccessing', subCode: 200 });

                                                } else if (response.data.status === 'rejected' || response.data.status === 'cancelled') {
                                                    txn.referenceId = response.data.id;
                                                    txn.status = 'FAILED';
                                                    txn.txn_msg = "issuer bank or payment service provider declined the transaction";


                                                    if (user.withdraw_holdbalance == txn.amount) {
                                                        user.Wallet_balance += txn.amount;
                                                        user.withdrawAmount += txn.amount;
                                                        user.withdraw_holdbalance -= txn.amount;
                                                    }
                                                    user.save();
                                                    txn.save();

                                                    res.status(200).send({ message: 'issuer bank or payment service provider declined the transaction', subCode: 200 });
                                                }
                                            })
                                            .catch(function (error) {
                                                //console.error('admin auto payout response error2');
                                                txn.status = 'FAILED';
                                                txn.txn_msg = "Withdraw request failed due to technical issue, try after some time.";


                                                if (user.withdraw_holdbalance == txn.amount) {
                                                    user.Wallet_balance += txn.amount;
                                                    user.withdrawAmount += txn.amount;
                                                    user.withdraw_holdbalance -= txn.amount;
                                                }
                                                user.save();
                                                txn.save();

                                                res.status(200).send({ message: 'Withdraw request failed due to technical issue, try after some time.', subCode: 200 });

                                            });
                                    }
                                )();

                            }
                            else {
                                res.status(200).send({ message: 'Amount must be less than and equal to Wallet amount', subCode: 999 });
                            }
                        }
                        else {
                            res.status(200).send({ message: 'Your previous request already in process', subCode: 999 });
                        }
                    } else {
                        res.status(200).send({ message: 'UPI Withdrawal limit is Rs.10000, You can use withdraw through bank', subCode: 999 });
                    }
                }
                else {
                    res.status(200).send({ message: 'You can\'t Withdrawal for 1 hour since the last withdrawal.', subCode: 999 });
                }
            }
            else {
                res.status(200).send({ message: 'You are enrolled in game.', subCode: 999 });
            }
        }
        else {
            res.status(200).send({ message: 'Withdrawal is failed please contact to admin.', subCode: 999 });
        }
    }
    catch (e) {
        console.log(e);
        res.status(200).send({ message: 'Withdrawal is failed, Due to technical issue.', subCode: 999 });
    }
})

//razorpay check payouts
router.post('/razorpaypayoutscheck/response', Auth, async (req, res) => {

    const orderID = req.body.txn_id;
    const referenceId = req.body.referenceId;
    const txn = await Transaction.findById(orderID);
    const user = await User.findById(txn.User_id);

    const withdraw = await Temp.findOne({ txn_id: txn._id });
    if (withdraw && withdraw.status == 'Pending') {
        res.send(txn);
    } else {
        //&& txn.status != "FAILED"
        if (txn._id == orderID && txn.referenceId == referenceId && txn.status != 'SUCCESS') {
            try {
                const axios = require("axios").default;
                const options = {
                    method: 'GET',
                    url: `https://${razorpayKey}:${razorpaySecretKey}@api.razorpay.com/v1/payouts/${referenceId}`
                };
                axios.request(options).then(function (response) {
                    console.log('payout capture', response);
                    const payout_id = response.data.id;
                    const payout_status = response.data.status;
                    const txn_id = response.data.reference_id;

                    console.log('razorpayoutrespo', payout_status);
                    if (payout_status == "processed") {

                        if (txn.status != "SUCCESS" && txn.status != "FAILED") {

                            txn.status = 'SUCCESS';
                            txn.txn_msg = 'Withdraw Transaction is Successful';

                            if (user.withdraw_holdbalance == txn.amount) {
                                user.totalWithdrawl += txn.amount;
                                user.withdraw_holdbalance -= txn.amount;
                            }
                            user.lastWitdrawl = Date.now();
                            user.save();
                            txn.save();
                            if (withdraw) {
                                withdraw.closing_balance = withdraw.closing_balance - withdraw.amount;
                                withdraw.status = 'SUCCESS';
                                withdraw.save();
                            }
                        }
                        res.send(txn);
                    }
                    else if (payout_status == "reversed") {

                        if (txn.status != "SUCCESS" && txn.status != "FAILED") {
                            txn.status = 'FAILED';
                            txn.txn_msg = response.data.status_details.description;

                            if (user.withdraw_holdbalance == txn.amount) {
                                user.Wallet_balance += txn.amount;
                                user.withdrawAmount += txn.amount;
                                user.withdraw_holdbalance -= txn.amount;
                            }
                            user.lastWitdrawl = Date.now();
                            user.save();
                            txn.save();
                            if (withdraw) {
                                withdraw.closing_balance = withdraw.closing_balance + withdraw.amount;
                                withdraw.status = 'FAILED';
                                withdraw.save();
                            }
                        }
                        res.send(txn);
                    }
                })
                    .catch(function (error) {
                        console.error('payout captur error1', error);
                        res.send(txn);
                    });
            } catch (err) {
                console.log('pay captur error2');
                res.send(txn);
            }

        } else {
            res.send(txn);
        }
    }


})



//payout withdrawAmount none/proccessing clear through api
router.post('/payout/response/api', Auth, async (req, res) => {

    const orderID = req.body.txn_id;
    const referenceId = req.body.referenceId;
    const txn = await Transaction.findById(orderID);
    const user = await User.findById(txn.User_id);

    // && txn.status != "FAILED"
    if (txn.status != 'SUCCESS') {
        txn.status = 'FAILED';
        txn.txn_msg = "issuer bank or payment service provider declined the transaction";

        if (user.withdraw_holdbalance == txn.amount) {
            user.Wallet_balance += txn.amount;
            user.withdrawAmount += txn.amount;
            user.withdraw_holdbalance -= txn.amount;
        }
        user.lastWitdrawl = Date.now();
        user.save();
        txn.save();
        res.send(txn);
    } else {
        res.send(txn);
    }
})




router.get("/total/deposit", Auth, async (req, res) => {
    try {
        const data = await Transaction.find({
            $and: [
                { Req_type: "deposit" },
                { status: "SUCCESS" }
            ]
        })

        let total = 0

        data.forEach((item) => {
            total += item.amount
        })

        res.status(200).send({ "data": total })
        // console.log(ress);
    } catch (e) {
        res.status(400).send(e)
        console.log(e);
    }
})

router.get("/total/withdraw", Auth, async (req, res) => {
    try {
        const data = await Transaction.find({
            $and: [
                { Req_type: "deposit" },
                { status: "withdraw" }
            ]
        })
        let total = 0

        data.forEach((item) => {
            total += item.amount
        })

        res.status(200).send({ "data": total })
        // console.log(ress);
    } catch (e) {
        res.status(400).send(e)
        console.log(e);
    }
})

// router.get("/withdrawlstatus/:id",Auth,async(req,res)=>{
//     try {
//         Payouts.Init(config.Payouts);

//         const withdraw=await Temp.findById(req.params.id);
//         const txn= await Transaction.findById(withdraw.txn_id);
//         const user= await User.findById(txn.User_id);
//         const response = await Transfers.GetTransferStatus({
//             "transferId": txn._id,
//         });
//         if(response.status=='ERROR' && response.subCode=='404')
//         {
//             if(txn.status==='FAILED')
//             {
//                 withdraw.closing_balance = withdraw.closing_balance + withdraw.amount;
//                 withdraw.status="FAILED";
//                 withdraw.save();
//             }else if(txn.status==='SUCCESS'){
//                 withdraw.closing_balance = withdraw.closing_balance - withdraw.amount;
//                 withdraw.status="SUCCESS";
//                 withdraw.save();
//             }
//             res.send({message:response.message});
//         }
//         else
//         {
//             if (response.status==='ERROR' && response.subCode==='403') {
//                 //console.log(txn.status)
//                 if(txn.status==='FAILED')
//                 {
//                     withdraw.closing_balance = withdraw.closing_balance + withdraw.amount;
//                     withdraw.status="FAILED";
//                     withdraw.save();
//                 }else{
//                     withdraw.closing_balance = withdraw.closing_balance - withdraw.amount;
//                     withdraw.status="SUCCESS";
//                     withdraw.save();
//                 }
//             }
//             if (response.data.transfer.status === 'SUCCESS') {
//                 if(txn.status!='SUCCESS')
//                 {
//                     txn.referenceId = response.data.transfer.referenceId;
//                     txn.status = response.data.transfer.status;

//                     if(user.withdraw_holdbalance >= txn.amount){
//                         user.withdraw_holdbalance -= txn.amount;
//                     }
//                     user.totalWithdrawl+=txn.amount
//                     await user.save();
//                     await txn.save()
//                     withdraw.status=response.data.transfer.status;
//                     withdraw.save();
//                 }else{
//                     if(txn.status==='FAILED')
//                     {
//                         withdraw.status="FAILED";
//                         withdraw.save();
//                     }else{
//                         withdraw.status="SUCCESS";
//                         withdraw.save();
//                     }
//                 }
//             }
//             else if(response.data.transfer.status === 'FAILED')
//             {
//                 if(txn.status!='FAILED')
//                 {
//                     txn.referenceId = response.data.transfer.referenceId;
//                     txn.status = response.data.transfer.status;
//                     user.Wallet_balance += txn.amount;
//                     user.withdrawAmount += txn.amount;
//                     if(user.withdraw_holdbalance >= txn.amount){
//                         user.withdraw_holdbalance -= txn.amount;
//                     }
//                     await user.save();
//                     await txn.save();
//                     withdraw.status="FAILED";
//                     withdraw.save();
//                 }else{
//                     if(txn.status==='FAILED')
//                     {
//                         withdraw.status="FAILED";
//                         withdraw.save();
//                     }else{
//                         withdraw.status="SUCCESS";
//                         withdraw.save();
//                     }
//                 }
//             }else{
//                 if(txn.status==='FAILED')
//                 {
//                     withdraw.status="FAILED";
//                     withdraw.save();
//                 }else{
//                     withdraw.status="SUCCESS";
//                     withdraw.save();
//                 }
//             }
//             res.send({message:response.data.transfer.status});
//         }
//     }
//     catch (err) {
//         console.log("err caught in getting transfer status");
//         console.log(err);
//         return;
//     }
// })


router.get("/withdrawreject/:id", async (req, res) => {
    try {
        const txn = await Transaction.findById(req.params.id);
        const user = await User.findById(txn.User_id);

        console.log("reject done1", user)

        if (user.withdraw_holdbalance > 0) {
            //const txn=await Transaction.findById(User_id);
            console.log("reject done2", txn.amount)
            user.Wallet_balance += txn.amount;
            user.withdrawAmount += txn.amount;
            user.withdraw_holdbalance -= txn.amount;
            //user.lastWitdrawl=null;
            user.lastWitdrawl = Date.now();
            //withdraw.closing_balance = withdraw.closing_balance + withdraw.amount;
            //withdraw.status = 'reject';

            txn.status = "FAILED";
            txn.txn_msg = "Withdraw rejected";
            txn.closing_balance = txn.closing_balance + txn.amount;
            console.log("reject done3", txn.closing_balance, user.withdraw_holdbalance, user.withdrawAmount, user.Wallet_balance)
            //withdraw.save();
            user.save();
            txn.save();
            res.status(200).send(txn)
        }
        else {
            res.send({ message: 'Invalid request', error: true })
        }
    } catch (e) {
        res.status(400).send(e)
    }
})





//user withdraw success update by admin side
router.post('/userwithdrawupdate/:id', Auth, async (req, res) => {
    console.log("==========================00000000000000000000000000000000000000000000000>>>>", req.params.id)
    if (req.body.status == "SUCCESS") {
        console.log("==========================111111111111111111111111111111111111111111111111>>>>", req.params.id)
        const orderID = req.params.id;
        const txn = await Transaction.findById(orderID);
        const temp_txn = await Temp.findOne({ txn_id: txn._id })
        const user = await User.findById(txn.User_id)
        if (txn.status != "SUCCESS" && txn.status != "FAILED") {
            console.log("==========================222222222222222222222222222222222222222222>>>>")
            const user = await User.findById(txn.User_id)
            txn.status = 'SUCCESS';
            txn.txn_msg = 'Transaction is Successful';
            txn.action_by = req.user.id;//Added By team
            txn.referenceId = req.body.referenceId;
            temp_txn.status = 'SUCCESS'
            user.totalWithdrawl += txn.amount;
            if (user.withdraw_holdbalance >= txn.amount) {
                user.withdraw_holdbalance -= txn.amount;
            }
            user.lastWitdrawl = Date.now();
            await user.save();
            await txn.save();
            await temp_txn.save();
        }

        res.status(200).json({ status: "ok", message: "response", responsecode: "200", data: null })
    }

    else if (req.body.status == "FAILED") {
        console.log("==========================33333333333333333333333333333333333333333333333333333333>>>>")
        const orderID1 = req.params.id;
        const txn1 = await Transaction.findById(orderID1);
        const temp_txn = await Temp.findOne({ txn_id: txn1._id })
        const user1 = await User.findById(txn1.User_id)
        if (txn1.status != "SUCCESS" && txn1.status != "FAILED") {
            console.log("==========================4444444444444444444444444444444444444444444444444444444444>>>>")
            txn1.status = 'FAILED';
            txn1.txn_msg = "issuer bank or payment service provider declined the transaction";
            txn1.referenceId = req.body.referenceId;
            temp_txn.status = 'FAILED'

            if (user1.withdraw_holdbalance == txn1.amount) {
                user1.Wallet_balance += txn1.amount;
                user1.withdrawAmount += txn1.amount;
                user1.withdraw_holdbalance -= txn1.amount;
            }
            await user1.save();
            await txn1.save();
            await temp_txn.save();
        }
        res.status(200).json({ status: "ok", message: "response", responsecode: "200", data: null })
    }
    else {
        res.status(200).json({ status: "ok", message: "response", responsecode: "200", data: null })
    }

})



//user deposit success update by admin side
router.post('/userdipositupdate/:id', Auth, async (req, res) => {

    if (req.body.status == "SUCCESS") {
        const orderID = req.params.id;
        const txn = await Transaction.findById(orderID);
        const user = await User.findById(txn.User_id)
        //if (txn.status != "PAID" && txn.status != "FAILED") {

        txn.status = "PAID";
        txn.txn_msg = "Deposit Transaction is Successful";
        user.Wallet_balance += txn.amount;
        user.totalDeposit += txn.amount;

        txn.closing_balance = user.Wallet_balance;

        await user.save();
        await txn.save();
        //}

        res.status(200).json({ status: "ok", message: "response", responsecode: "200", data: null })
    }

    else if (req.body.status == "FAILED") {
        const orderID1 = req.params.id;
        const txn1 = await Transaction.findById(orderID1);
        const user1 = await User.findById(txn1.User_id)
        // if (txn1.status != "PAID" && txn1.status != "FAILED") {
        txn1.status = 'FAILED';
        txn1.txn_msg = "issuer bank or payment service provider declined the transaction";

        await user1.save();
        await txn1.save();
        // }
        res.status(200).json({ status: "ok", message: "response", responsecode: "200", data: null })
    }
    else {
        res.status(200).json({ status: "ok", message: "response", responsecode: "200", data: null })
    }

})

//webhook-payouts-razorpay
router.post('/webhook-payouts-razorpay', async (req, res) => {
    //console.log("razorpay webhook",req.body);
    //console.log("razorpay webhook payload",req.body.payload);
    //console.log("razorpay webhook payoutentity",req.body.payload.payout.entity);
    if (req.body.payload && req.body.payload.payout && req.body.payload.payout.entity) {
        const payout_id = req.body.payload.payout.entity.id;
        const payout_status = req.body.payload.payout.entity.status;
        const txn_id = req.body.payload.payout.entity.reference_id;

        //console.log('razorpayoutrespo',payout_status);
        if (payout_status == "processed") {
            const orderID = txn_id;
            const txn = await Transaction.findById(orderID);


            if (txn.status != "SUCCESS" && txn.status != "FAILED") {

                const withdraw = await Temp.findOne({ txn_id: txn._id });

                const user = await User.findById(txn.User_id)
                txn.status = 'SUCCESS';
                txn.txn_msg = 'Withdraw Transaction is Successful';
                txn.referenceId = payout_id;

                if (user.withdraw_holdbalance == txn.amount) {
                    user.totalWithdrawl += txn.amount;
                    user.withdraw_holdbalance -= txn.amount;
                }

                await user.save();
                await txn.save();
                if (withdraw) {
                    withdraw.closing_balance = withdraw.closing_balance - withdraw.amount;
                    withdraw.status = 'SUCCESS';
                    await withdraw.save();
                }
            }

            res.status(200).json({ status: "ok", message: "response", responsecode: "200", data: null })
        }
        else if (payout_status == "reversed") {
            const orderID1 = txn_id;
            const txn1 = await Transaction.findById(orderID1);

            const user1 = await User.findById(txn1.User_id);

            const withdraw1 = await Temp.findOne({ txn_id: txn1._id });

            if (txn1.status != "SUCCESS" && txn1.status != "FAILED") {
                txn1.status = 'FAILED';
                txn1.txn_msg = req.body.payload.payout.entity.status_details.description;
                txn1.referenceId = payout_id;

                if (user1.withdraw_holdbalance == txn1.amount) {
                    user1.Wallet_balance += txn1.amount;
                    user1.withdrawAmount += txn1.amount;
                    user1.withdraw_holdbalance -= txn1.amount;
                }

                await user1.save();
                await txn1.save();
                if (withdraw1) {
                    withdraw1.closing_balance = withdraw1.closing_balance + withdraw1.amount;
                    withdraw1.status = 'FAILED';
                    await withdraw1.save();
                }


            }
            res.status(200).json({ status: "ok", message: "response", responsecode: "200", data: null })
        }
        else {
            res.status(200).json({ status: "ok", message: "response", responsecode: "200", data: null })
        }
    } else {
        res.status(200).json({ status: "ok", message: "response", responsecode: "200", data: null })
    }
})


module.exports = router