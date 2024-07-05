const express = require("express")
const User = require("../Model/User")
const Setting = require("../Model/settings")
const router = express.Router()
const bcrypt = require("bcryptjs")
const Auth = require("../Middleware/Auth")
const RoleBase = require("../Middleware/Role")
const twofactor = require("node-2fa");
const https = require('https');
const request = require("request")
const moment = require("moment")
const path = require("path")
const Game = require("../Model/Games");
const multer = require("multer")
const sharp = require("sharp")
const fs = require("fs")
const { v4: uuidv4 } = require('uuid');
const randomstring = require("randomstring");
const myTransaction = require("../Model/myTransaction")
const AdminEarning = require("../Model/AdminEaring")
const Transaction = require("../Model/transaction")
// const Notification = require("../Model/Notification")
const Temp = require("../Model/temp/temp")
const GatewaySettings = require("../Model/Gateway");
const profanity = require("profanity-hindi");
// let phoneNumber=undefined;
const storage = multer.memoryStorage();
const upload = multer({ storage });
const Aadhaar = require("../Model/Kyc/Aadharcard")
const ReferralHis = require("../Model/referral")
var serverKey = "AAAA8upAwPs:APA91bEyJkpPnc57e28-3a_Gqs4d_SjjYYYom8aP037FXsx5VtwASW933QXbUEH_14rKyTgIaNSXM8MdoQx_llmlt0wwYcjce6zGxWbULe8tKIyLtSC5P1wvYyFGboZv26ZwVOz4Xh9B";
// var FCM = require('fcm-node');
// var fcm = new FCM(serverKey);

const code_gen = async () => {
    let code = Math.floor(Math.random() * 1000000);
    let check = await User.findOne({ referral_code: code });
    if (code.toString().length < 6) {
        return code_gen();
    }
    if (check) {
        return code_gen();
    }
    return code;
};

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, "public/profilepic");
//     },
//     filename: function (req, file, cb) {
//         const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//         cb(null, uniqueSuffix + path.extname(file.originalname));
//     },
// });
// const fileFilter = (req, file, cd) => {
//     if (
//         (file.mimetype === "image/jpg",
//             file.mimetype === "image/jpeg",
//             file.mimetype === "image/png")
//     ) {
//         cd(null, true);
//     } else {
//         cd(null, false);
//     }
// };

// const upload = multer({
//     storage: storage,
//     limits: {
//         fileSize: 100000000000,
//     },
// });

router.post('/users/me/avatar', Auth, upload.single('avatar'), async (req, res) => {
    //console.log(req.file);
    fs.access("./public/profilepic", (error) => {
        if (error) {
            fs.mkdirSync("./public/profilepic");
        }
    });
    const { buffer, originalname } = req.file;
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);

    const ref = `${uniqueSuffix}.webp`;
    //console.log(buffer);
    await sharp(buffer)
        .webp({ quality: 20 })
        .toFile("./public/profilepic/" + ref);

    req.user.avatar = "public/profilepic/" + ref,
        await req.user.save()
    res.send()

}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

router.post('/users/upload-transaction', Auth, upload.single('Transaction_Screenshot'), async (req, res) => {
    //console.log(req.file);

    const alreadyDeposit = await Temp.findOne({ user: req.user._id, status: "pending" });
    const setting = await Setting.findOne({})
    if(req.body.amount < setting.minimumDeposit) return res.json({ success: false, msg: `Minimum deposit is ${setting.minimumDeposit}` })
    if(req.body.amount > setting.maximumDeposit) return res.json({ success: false, msg: `Maximum deposit is ${setting.maximumDeposit}` })
    if(alreadyDeposit) return res.json({ success: false, msg: "You can't deposit. Already deposit requested." })

    fs.access("./public/transactions", (error) => {
        if (error) {
            fs.mkdirSync("./public/transactions");
        }
    });
    const { buffer, originalname } = req.file;
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);

    const ref = `${uniqueSuffix}.webp`;
    //console.log(buffer);
    await sharp(buffer)
        .webp({ quality: 20 })
        .toFile("./public/transactions/" + ref);


    console.log("_____________________________USER________________________")
    const txn1 = new Transaction();
    txn1.amount = req.body.amount;
    txn1.User_id = req.user._id;
    txn1.Req_type = 'deposit';
    txn1.Withdraw_type = "UPI";
    txn1.payment_gatway = 'manual';
    txn1.status = 'Pending';
    txn1.referenceId = req.body.referenceId;
    txn1.Transaction_Screenshot = "public/transactions/" + ref
    txn1.closing_balance = req.user.Wallet_balance;
    const txn1_ = await txn1.save();


    const temp = new Temp();
    temp.Req_type = "deposit";
    //temp.type = req.body.type;
    temp.user = req.user._id;
    temp.status = "pending";
    temp.closing_balance = req.user.Wallet_balance;
    temp.amount = req.body.amount;
    temp.Transaction_Screenshot = "public/transactions/" + ref;
    temp.txn_id = txn1._id;
    temp.save();

    console.log("_________________________TXN__________________________", txn1_);

    res.send(txn1_)

}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

router.patch("/agent/permission/:id", async (req, res) => {
    try {
        const permission =
            [
                { Permission: 'dashboard', Status: false },
                { Permission: 'earning', Status: false },
                { Permission: 'allAdmin', Status: false },
                { Permission: 'allUsers', Status: false },
                { Permission: 'kycDetail', Status: false },
                { Permission: 'allIncome', Status: false },
                { Permission: 'allGame', Status: false },
                { Permission: 'completedGame', Status: false },
                { Permission: 'conflictGame', Status: false },
                { Permission: 'cancelledGame', Status: false },
                { Permission: 'runningGame', Status: false },
                { Permission: 'dropGame', Status: false },
                { Permission: 'penaltyBonus', Status: false },
                { Permission: 'deposit', Status: false },
                { Permission: 'withdrawl', Status: false },
                { Permission: 'transactionHistory', Status: false },
                { Permission: 'masterSetting', Status: false },
            ];

        const data = await User.findByIdAndUpdate(req.params.id, { $push: { Permissions: permission } }, { new: true })
        res.send(data)
    } catch (e) {
        res.send(e)
        console.log(e);
    }

})
router.post("/agent/permission/nested/:id", Auth, async (req, res) => {
    try {
        const updateResult = await User.findOneAndUpdate(
            { 'Permissions._id': req.params.id },
            { 'Permissions.$.Status': req.body.Status }
        );
        res.send(updateResult)
    } catch (e) {
        res.send(e)
        console.log(e);
    }

})

router.post("/agent/delete/:id", Auth, async (req, res) => {
    try {
        const id = req.params.id;
        const deleted = await User.findByIdAndDelete(id);
        res.send(deleted)
    } catch (e) {
        res.send(e)
        console.log(e);
    }

})




router.post('/addBank', Auth, async (req, res) => {
    const { account_number, ifsc_code, holder_name } = req.body;
    try {
        let user = await User.findByIdAndUpdate(req.user._id, { account_number, ifsc_code, holder_name }, { new: true })
        res.status(200).send(user)
    } catch (e) {
        res.status(500).send()
    }
});

router.post("/kyc-otp", Auth, async (req, res) => {
    const { aadharNumber, Name, Email } = req.body;
    try {
        console.log(req.user.id)
        let aadhar = await Aadhaar.findOne({ User: req.user.id })
        let user = await User.findOne({ _id: req.user.id });
        user.Name = Name;
        user.Email = Email;
        await user.save();
        console.log(aadhar, "+++++++++++++++++++++++++++++", typeof aadhar)
        if (aadhar == null) {
            aadhar = new Aadhaar({
                User: req.user.id,
                Number: aadharNumber,
            })
            console.log(aadhar)
        }
        const { access_token } = await getAccessToken();
        // console.log(aadhar)
        const options = {
            'method': 'POST',
            'url': `https://api.sandbox.co.in/kyc/aadhaar/okyc/otp`,
            'headers': {
                'Authorization': access_token,
                'x-api-key': "key_live_srjT1HlMQErLleJRJX2mky1BZsQpnMfi",
                'x-api-version': "2.0",
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "aadhaar_number": aadharNumber
            })
        };

        let RR = await __request(options);
        const { code, data } = RR;
        console.log(JSON.stringify(RR), code, data, typeof code);

        if (code == 200) {
            if (data.ref_id) {
                aadhar.ref_id = data.ref_id;
                await aadhar.save()
                res.status(200).send({
                    status: 200,
                    msg: "OTP sent to the number attached with the aadhar.",
                });
            } else {
                res.status(code).send({
                    status: code,
                    msg: "",
                });
            }
        } else {
            res.status(code).send({
                status: code,
                msg: "",
            });
        }

    } catch (e) {
        res.status(400).send(e);
        console.log(e);
    }
});

router.post("/kyc-otp-verify", Auth, async (req, res) => {
    const { otp } = req.body;
    try {
        let aadhar = await Aadhaar.findOne({ User: req.user.id })

        const { access_token } = await getAccessToken();

        const options = {
            'method': 'POST',
            'url': `https://api.sandbox.co.in/kyc/aadhaar/okyc/otp/verify`,
            'headers': {
                'Authorization': access_token,
                'x-api-key': "key_live_srjT1HlMQErLleJRJX2mky1BZsQpnMfi",
                'x-api-version': "2.0",
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "otp": otp,
                "ref_id": aadhar.ref_id
            })
        };


        const response = await __request(options);
        const { code, data } = response;

        if (code == 200) {
            if (data.status == "VALID") {
                aadhar.data = JSON.stringify(data);
                await User.findOneAndUpdate({ _id: req.user.id }, { verified: "verified" });
                res.status(200).send({
                    status: 200,
                    msg: "Aadhar verified successfully",
                });
            } else {
                res.status(500).send({
                    status: 500,
                    msg: "",
                });
            }
        } else if (code == 500) {
            res.status(500).send({
                status: 500,
                msg: "",
            });
        } else {
            res.status(500).send({
                status: 500,
                msg: "",
            });
        }

    } catch (e) {
        res.status(400).send(e);
        console.log(e);
    }
});

// router.post('/users/me/avatar', Auth, upload.single('avatar'), async (req, res) => {
//     if(req.file.path){

//         req.user.avatar = req.file.path,
//         await req.user.save()
//         res.send()
//     }else{
//     }

// }, (error, req, res, next) => {
//     res.status(400).send({ error: error.message })
// })

router.delete('/users/me/avatar', Auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})



router.get('/users/avatar/:id', Auth, async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if (!user || !user.avatar) {
            throw new Error()
        }

        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    } catch (e) {
        res.status(404).send()
    }
})

router.get('/total/successful-game-amount', Auth, async (req, res) => {
    try {
        let successfulGameAmount = 0;
        const completedGame = await Game.find({ Status: "completed" }).lean();
        completedGame.forEach((item) => {
            successfulGameAmount += item.Game_Ammount;
        })

        // return res.sendStatus(200).send(successfulGameAmount)
        res.status(200).send({ successfulGameAmount })

    } catch (e) {
        console.log(e)
        res.sendStatus(400)
    }
})



router.post("/admin/register", async (req, res) => {
    const { Name, Password, Phone, user_type, twofactor_code } = req.body
    try {

        let user = await User.findOne({ Phone })
        if (user && user.OTP_verified) {
            return res.send("Phone have already")
        }

        if (user) {
            await User.findOneAndDelete({ Phone })
        }

        user = new User({
            Name,
            Password,
            Phone,
            user_type,
            referral_code: await code_gen()
        })

        const token = await user.genAuthToken();

        const salt = await bcrypt.genSalt(10);
        user.Password = await bcrypt.hash(user.Password, salt);

        user.save()
        res.status(200).send({ msg: "success", user, token })

    } catch (e) {
        res.status(400).send(e)
        console.log(e);
    }
})
router.get("/agent/all", Auth, async (req, res) => {
    try {
        let page = (req.query.page == 0) ? 0 : parseInt(req.query.page - 1);
        const PAGE_SIZE = req.query._limit;
        const admin = await User.find({ user_type: "Agent" }).skip(PAGE_SIZE * page)
        const total = await User.countDocuments({ user_type: "Agent" })
        res.status(200).send({ totalPages: Math.ceil(total / PAGE_SIZE), admin })
    } catch (e) {
        res.status(400).send(e)
    }
})



router.post("/user/forget-password", Auth, async (req, res) => {
    const { Password, ConfirmPassword } = req.body
    try {

        let user = await User.findOne({ _id: req.user._id })
        if (user) {
            return res.send("Unauthorized !")
        }

        if (Password !== ConfirmPassword) {
            return res.send("Password and Confirm Password must be same!")
        }

        const salt = await bcrypt.genSalt(10);
        user.Password = await bcrypt.hash(Password, salt);

        user.save()
        res.status(200).send({ msg: "success" })

    } catch (e) {
        res.status(400).send(e)
        console.log(e);
    }
})



router.post("/login", async (req, res) => {
    try {
        const { Password, Phone } = req.body
        let user = await User.findOne({ Phone: Phone });
        if (user) {
            if (user.user_type == "Block") {
                return res.json({
                    msg: "You are Blocked. Please contact to admin.",
                    status: 101,
                });
            }

            if (user && !user.OTP_verified) {
                return res.json({
                    msg: "User does not exist.",
                    status: 101,
                });
            }

            const match = await bcrypt.compare(Password, user.Password);
            if (match) {
                const token = await user.genAuthToken();
                res.status(200).send({
                    status: 200,
                    msg: "login successful",
                    token, user,
                });
            } else {
                res.status(401).send({
                    status: 101,
                    msg: "Wrong password"
                });
            }

        } else {
            return res.status(404).send({ msg: "Invalid User", status: 404 })
        }
    } catch (e) {
        res.status(400).send(e)
        console.log(e);
    }
})


router.post("/register", async (req, res) => {
    try {

        const { Password, Phone, Email, referral, Name } = req.body
        const _Name = randomstring.generate({
            length: 6,
            charset: 'alphabetic'
        });

        const SecretCode = twofactor.generateSecret({ name: _Name, Phone: Phone });
        const newSecret = twofactor.generateToken(SecretCode.secret);

        let user = await User.findOne({ Phone: Phone });

        if (user && user.user_type == "Block") {
            return res.json({
                msg: "You are Blocked. Please contact to admin.",
                status: 101,
            });
        }

        if (user && user.OTP_verified) {
            return res.json({
                status: 101,
                msg: "Account already exists"
            });
        }


        if (user) {
            await User.findOneAndDelete({ Phone })
        }


        let referralBy = null;
        const Exist = await User.findOne({ referral_code: referral });
        if (Exist) {
            referralBy = referral;
        }
        const newUser = new User({
            Name,
            Password,
            Phone,
            Email,
            user_type: "User",
            referral: referralBy,
            referral_code: await code_gen()
        })
        const salt = await bcrypt.genSalt(10);
        newUser.Password = await bcrypt.hash(newUser.Password, salt);
        // newUser.otp = newSecret.token;
        newUser.otp = 835769;
        await newUser.save();

        https.get(`https://www.fast2sms.com/dev/bulkV2?authorization=&variables_values=${newSecret.token}&route=otp&numbers=${Phone}`, (resp) => {
            console.log("send");
        })

        return res.json({
            status: 200,
            msg: "OTP verification Required",
            secret: SecretCode.secret
        });

    } catch (e) {
        res.status(400).send(e)
        console.log(e);
    }
})

router.post("/resend-otp", async (req, res) => {
    try {

        const { Phone } = req.body
        let user = await User.findOne({ Phone: Phone });
        if (user) {


            if (user.user_type == "Block") {
                return res.json({
                    msg: "You are Blocked. Please contact to admin.",
                    status: 101,
                });
            } else {

                const SecretCode = twofactor.generateSecret({ name: user.Name, Phone: Phone });
                const newSecret = twofactor.generateToken(SecretCode.secret);

                let _user = await User.findOne({ Phone: Phone });
                _user.otp = newSecret.token;
                await _user.save();


                https.get(`https://www.fast2sms.com/dev/bulkV2?authorization=VjGzqhQ5YrZH9vxabiJCmAlfkKpSd072W4LXEs6nFB8ueMDTPIfK9gNahyJ0SojWO5YlE7AcbnXZvGCM&variables_values=${newSecret.token}&route=otp&numbers=${Phone}`, (resp) => {
                    console.log("send");
                })


                return res.json({
                    status: 200,
                    msg: "OTP verification Required",
                    secret: SecretCode.secret
                });

            }
        } else {
            return res.status(404).send({ msg: "Invalid User", status: 404 });
        }
    } catch (e) {
        res.status(400).send(e)
        console.log(e);
    }
})

router.post("/verify-otp", async (req, res) => {
    try {

        const { Phone, twofactor_code, secretCode } = req.body
        let user = await User.findOne({ Phone: Phone });
        if (user) {

            if (user.otp != twofactor_code) {
                console.log('Invalid Two Factor Code')
                return res.send({ msg: "Invalid OTP", status: 403 });
            } else if (user.user_type == "Block") {
                return res.json({
                    msg: "You are Blocked. Please contact to admin.",
                    status: 403,
                });
            } else {
                if (twofactor_code != "835769") {
                    return res.json({ status: 101, msg: "Invalid OTP!" });
                }
                //const matched = twofactor.verifyToken(secretCode, twofactor_code);
                // if (!matched) {
                //     return res.json({ status: 101, msg: "Invalid OTP!" });
                // }
                else {
                    user.OTP_verified = true;
                    await user.save()

                    const token = await user.genAuthToken();
                    res.status(200).send({
                        status: 200,
                        msg: "login successful",
                        token, user,
                    });
                }
            }
        } else {
            return res.status(404).send({ msg: "Invalid User", status: 404 });
        }
    } catch (e) {
        res.status(400).send(e)
        console.log(e);
    }
})

router.post("/user/change-password", async (req, res) => {
    try {

        const { Phone, twofactor_code, secretCode, Password } = req.body
        let user = await User.findOne({ Phone: Phone });
        if (user) {

            if (user.otp != twofactor_code) {
                console.log('Invalid Two Factor Code')
                return res.send({ msg: "Invalid OTP", status: 403 });
            } else if (user.user_type == "Block") {
                return res.json({
                    msg: "You are Blocked. Please contact to admin.",
                    status: 403,
                });
            } else {
                const matched = twofactor.verifyToken(secretCode, twofactor_code);
                if (!matched) {
                    return res.json({ status: 101, msg: "Invalid OTP!" });
                }
                else {

                    const salt = await bcrypt.genSalt(10);
                    user.Password = await bcrypt.hash(Password, salt);
                    await user.save()

                    const token = await user.genAuthToken();


                    res.status(200).send({
                        status: 200,
                        msg: "Password changed successfully",
                        token, user,
                    });
                }
            }
        } else {
            return res.status(404).send({ msg: "Invalid User", status: 404 });
        }
    } catch (e) {
        res.status(400).send(e)
        console.log(e);
    }
})



router.get('/all/user/data/get', Auth, async (req, res) => {
    try {
        let todaySuccessAmount = 0;
        let todayCommission = 0;
        let todayTotalDeposit = 0;
        let todayTotalWithdraw = 0;
        let totolWonAmount = 0;
        let totalLoseAmount = 0;
        let totalHoldBalance = 0;
        let totalWithdrawHold = 0;
        let totalDeposit = 0;
        let totalWithdrawl = 0;
        let totalReferralEarning = 0;
        let totalReferralWallet = 0;
        let totalWalletbalance = 0;
        var now = new Date();
        var startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const totalUser = await User.find({ user_type: "User" });
        const todayUser = await User.find({ $and: [{ createdAt: { $gte: startOfToday } }, { user_type: "User" }] }).countDocuments();
        const todaySuccessGame = await Game.find({ $and: [{ createdAt: { $gte: startOfToday } }, { Status: "completed" }] });
        const todayCancelGame = await Game.find({ $and: [{ createdAt: { $gte: startOfToday } }, { Status: "cancelled" }] }).countDocuments();
        const todayAllGame = await Game.find({ createdAt: { $gte: startOfToday } }).countDocuments();
        const totalGame = await Game.find().countDocuments();
        const todayCommissionEntry = await AdminEarning.find({ createdAt: { $gte: startOfToday } });
        const todayDepositEntry = await Transaction.find({
            $or: [
                { $and: [{ createdAt: { $gte: startOfToday } }, { status: "SUCCESS" }, { Req_type: "deposit" }] },
                { $and: [{ createdAt: { $gte: startOfToday } }, { status: "PAID" }, { Req_type: "deposit" }] },
                { $and: [{ createdAt: { $gte: startOfToday } }, { status: "success" }, { Req_type: "deposit" }] },
            ]
        });
        const todayWithdrawEntry = await Transaction.find({
            $or: [
                { $and: [{ createdAt: { $gte: startOfToday } }, { status: "SUCCESS" }, { Req_type: "withdraw" }] },
                { $and: [{ createdAt: { $gte: startOfToday } }, { status: "PAID" }, { Req_type: "withdraw" }] },
                { $and: [{ createdAt: { $gte: startOfToday } }, { status: "success" }, { Req_type: "withdraw" }] },
            ]
        });


        const todayClassic = await Game.find({ $and: [{ createdAt: { $gte: startOfToday } }, { Game_type: "Ludo Classics" }, { Status: "completed" }] }).countDocuments();
        const todayPopular = await Game.find({ $and: [{ createdAt: { $gte: startOfToday } }, { Game_type: "Ludo Popular" }, { Status: "completed" }] }).countDocuments();
        const todayGotiOne = await Game.find({ $and: [{ createdAt: { $gte: startOfToday } }, { Game_type: "Ludo 1 Goti" }, { Status: "completed" }] }).countDocuments();
        const todayGotiTwo = await Game.find({ $and: [{ createdAt: { $gte: startOfToday } }, { Game_type: "Ludo 2 Goti" }, { Status: "completed" }] }).countDocuments();
        const todayUltaGame = await Game.find({ $and: [{ createdAt: { $gte: startOfToday } }, { Game_type: "Ludo Ulta" }, { Status: "completed" }] }).countDocuments();

        let txns = await Transaction.find({ createdAt: { $gte: startOfToday }, $or: [{ status: "SUCCESS" }, { status: "PAID" }], $or: [{ Req_type: "deposit" }, { Req_type: "deposit" }] }).lean();
        const ids = txns.map(txn => txn.User_id)
        const todayZeroBalance = await User.find({ createdAt: { $gte: startOfToday }, Wallet_balance: 0, _id: { $nin: ids }, user_type: "User" }).countDocuments()


        let todaySuccessfullGameAmount = 0;
        const completedGame = await Game.find({ createdAt: { $gte: startOfToday }, Status: "completed" }).lean();
        completedGame.forEach((item) => {
            todaySuccessfullGameAmount += item.Game_Ammount;
        })


        totalUser.forEach((item) => {
            totolWonAmount += item.wonAmount;
            totalLoseAmount += item.loseAmount;
            totalHoldBalance += item.hold_balance;
            totalWithdrawHold += item.withdraw_holdbalance;
            totalDeposit += item.totalDeposit;
            totalWithdrawl += item.totalWithdrawl;
            totalReferralEarning += item.referral_earning;
            totalReferralWallet += item.referral_wallet;
            totalWalletbalance += item.Wallet_balance;
        })
        todayWithdrawEntry.forEach((item) => {
            todayTotalWithdraw += item.amount;
        })
        todayDepositEntry.forEach((item) => {
            todayTotalDeposit += item.amount;
        })
        todayCommissionEntry.forEach((item) => {
            todayCommission += item.Ammount;
        })
        todaySuccessGame.forEach((item) => {
            todaySuccessAmount += item.Game_Ammount;
        })
        const data = {
            totalUser: totalUser.length,
            todayUser: todayUser,
            todayAllGame: todayAllGame,
            todaySuccessGame: todaySuccessGame.length,
            todayCancelGame: todayCancelGame,
            totalGame: totalGame,
            todayCommission: todayCommission,
            todayTotalDeposit: todayTotalDeposit,
            todayTotalWithdraw: todayTotalWithdraw,
            totolWonAmount: totolWonAmount,
            totalLoseAmount: totalLoseAmount,
            totalHoldBalance: totalHoldBalance,
            totalWithdrawHold: totalWithdrawHold,
            totalDeposit: totalDeposit,
            totalWithdrawl: totalWithdrawl,
            totalReferralEarning: totalReferralEarning,
            totalReferralWallet: totalReferralWallet,
            totalWalletbalance: totalWalletbalance,
            todayTotalCommissionAmount: 0,
            todayTotalReferAmount: 0,
            todayClassic,
            todayPopular,
            todayGotiOne,
            todayGotiTwo,
            todayUltaGame,
            todayZeroBalance,
            todaySuccessfullGameAmount
        }
        res.send(data);
    } catch (error) {
        console.log(error);
    }
})


router.get("/total/user", Auth, async (req, res) => {
    try {
        const admin = await User.find({ user_type: 'User' }).countDocuments();
        res.status(200).send(admin.toString());

    } catch (e) {
        res.status(400).send(e)
    }
})
router.get("/total/zero-balance", Auth, async (req, res) => {
    try {

        let txns = await Transaction.find({
            $or: [
                { $or: [{ status: "SUCCESS" }, { Req_type: "deposit" }, { status: "PAID" }, { Req_type: "deposit" }] },
            ]
        }).lean();
        const ids = txns.map(txn => txn.User_id)
        console.log("+_________________________________________________++++++++++++++++++++++++++++++++______________________________");
        const admin = await User.find({ Wallet_balance: 0, _id: { $nin: ids }, user_type: "User" }).countDocuments()
        res.status(200).send(admin.toString())

    } catch (e) {
        res.status(400).send(e)
    }
})

router.get("/get_user/:id", Auth, async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate("action_by");
        res.status(200).send(user);
    } catch (e) {
        res.status(400).send(e)
   }
})
router.get("/total/admin", Auth, RoleBase("Admin"), async (req, res) => {
    try {
        const admin = await User.find({ user_type: "Admin" }).countDocuments()

        res.status(200).send(admin.toString())

    } catch (e) {
        res.status(400).send(e)
    }
})
router.get("/total/block", Auth, async (req, res) => {
    try {
        const admin = await User.find({ user_type: "Block" }).countDocuments()

        res.status(200).send(admin.toString())

    } catch (e) {
        res.status(400).send(e)
    }
})
router.get("/total/active", Auth, async (req, res) => {
    try {
        const order = await User.find({
            $and: [
                { Wallent_balance: { $gt: 0 } },
                { user_type: "User" },
            ],
        }).countDocuments();

        res.status(200).send(order.toString());
    } catch (e) {
        res.status(400).send(e);
    }
});
router.get("/challange/completed", Auth, async (req, res) => {
    try {
        const admin = await Game.find({ Status: "completed" }).countDocuments()

        res.status(200).send(admin.toString())

    } catch (e) {
        res.status(400).send(e)
    }
})
router.get("/challange/active", Auth, async (req, res) => {
    try {
        const admin = await Game.find({ $or: [{ Status: "running" }, { Status: "pending" }] }).countDocuments()

        res.status(200).send(admin.toString())

    } catch (e) {
        res.status(400).send(e)
    }
})
router.get("/challange/running", Auth, async (req, res) => {
    try {
        const admin = await Game.find({ Status: "requested" }).countDocuments()

        res.status(200).send(admin.toString())

    } catch (e) {
        res.status(400).send(e)
    }
})
router.get("/challange/cancelled", Auth, async (req, res) => {
    try {
        const admin = await Game.find({ Status: "cancelled" }).countDocuments()

        res.status(200).send(admin.toString())

    } catch (e) {
        res.status(400).send(e)
    }
})
router.get("/total/deposit", Auth, async (req, res) => {
    try {
        const data = await Transaction.find({
            Req_type: "deposit",
            $or: [
                { status: "success" },
                { status: "SUCCESS" }
            ]
        })

        console.log("______***************************************((_______________________________", data)
        const countDeposit = await Transaction.find({
            $and: [
                { Req_type: "deposit" },
            ]
        }).countDocuments();

        let total = 0

        data.forEach((item) => {
            total += item.amount
        })

        res.status(200).send({ "data": total, "count": countDeposit })
        // console.log(ress);
    } catch (e) {
        res.status(400).send(e)
        console.log(e);
    }
})


router.get("/total/withdrawal", Auth, async (req, res) => {
    try {
        const data = await Transaction.find({
            $and: [
                { Req_type: "withdraw" },
                { status: "SUCCESS" }
            ]
        })
        const countWithdraw = await Transaction.find({
            $and: [
                { Req_type: "withdraw" },
            ]
        }).countDocuments();

        let total = 0

        data.forEach((item) => {
            total += item.amount
        })

        res.status(200).send({ "data": total, "count": countWithdraw })
        // console.log(ress);
    } catch (e) {
        res.status(400).send(e)
        console.log(e);
    }
})





router.get("/total/refer-amount", Auth, async (req, res) => {
    try {
        const data = await Transaction.find({
            $and: [
                { Req_type: "withdraw" },
                { status: "SUCCESS" }
            ]
        })
        const countWithdraw = await Transaction.find({
            $and: [
                { Req_type: "withdraw" },
            ]
        }).countDocuments();

        let total = 0

        data.forEach((item) => {
            total += item.amount
        })

        res.status(200).send({ "data": 0, "count": 0 })
        // console.log(ress);
    } catch (e) {
        res.status(400).send(e)
        console.log(e);
    }
})

router.get("/total/commission-amount", Auth, async (req, res) => {
    try {
        const data = await AdminEarning.find({})
        const countAdminEaring = await AdminEarning.find({}).countDocuments();

        let total = 0

        data.forEach((item) => {
            total += item.Ammount
        })

        res.status(200).send({ "data": total, "count": countAdminEaring })
        // console.log(ress);
    } catch (e) {
        res.status(400).send(e)
        console.log(e);
    }
})




router.get("/count/new/deposit", Auth, async (req, res) => {
    try {
        const countDeposit = await Transaction.find({
            $and: [
                { Req_type: "deposit" },
                { status: "Pending" }
            ]
        }).countDocuments();
        let total = parseInt(countDeposit);
        res.status(200).send({ "count": total });
        // console.log(ress);
    } catch (e) {
        res.status(400).send(e)
        console.log(e);
    }
})


router.get("/admin/all", Auth, async (req, res) => {
    try {
        const PAGE_SIZE = req.query._limit;
        let page = (req.query.page == 0) ? 0 : parseInt(req.query.page - 1);
        const admin = await User.find({ user_type: "Admin" }).skip(PAGE_SIZE * page)
        const total = await User.countDocuments({ user_type: "Admin" })

        res.status(200).send({ totalPages: Math.ceil(total / PAGE_SIZE), admin })

    } catch (e) {
        res.status(400).send(e)
    }
})

router.get("/total/kyc-complete", Auth, async (req, res) => {
    try {

        console.log("--------------------total/kyc-complete------------_______________")
        const admin = await User.find({ verified: "verified" }).countDocuments();
        res.status(200).send(admin.toString())

    } catch (e) {
        console.log(e);
        res.status(400).send(e)
    }
})

router.get("/total/kyc-pending", Auth, async (req, res) => {
    try {
        console.log("--------------------kyc-pending------------_______________")
        const admin = await User.find({ $or: [{ verified: "unverified" }, { verified: "pending" }] }).countDocuments()
        res.status(200).send(admin.toString())

    } catch (e) {
        console.log(e);
        res.status(400).send(e)
    }
})



router.get("/User/all/panelty", Auth, async (req, res) => {
    const searchq = req.query._q;
    const searchtype = req.query._stype;
    const PAGE_SIZE = req.query._limit;
    let page = (req.query.page == 0) ? 0 : parseInt(req.query.page - 1);
    try {
        let query = {};
        query = await handleQuery(req, {})
        if (searchq != 0 && searchtype != 0) {
            page = parseInt("0");
            query[searchtype] = (searchtype === 'Phone' || searchtype === '_id') ? searchq : new RegExp(searchq, 'i')
        } else {
            query = {};
        }
        if (searchtype === 'Phone' && searchq) {
            delete query[searchtype]
        }
        let total = await User.countDocuments(query).where("user_type").nin(["Admin", "Agent"]);
        let admin = await User.find(query).where("user_type").nin(["Admin", "Agent"]).limit(PAGE_SIZE).skip(PAGE_SIZE * page)
        if (searchtype === 'Phone' && searchq) {
            ({ total, admin } = await handleSearchingPhone(admin, searchq))
        }
        res.status(200).send({ totalPages: Math.ceil(total / PAGE_SIZE), admin })

    } catch (e) {
        console.log(e.message)
        res.status(400).send(e)
    }
})


router.get("/User/user-transaction/", Auth, async (req, res) => {
    const PAGE_SIZE = req.query._limit;
    let page = (req.query.page == 0) ? 0 : parseInt(req.query.page - 1);
    try {
        let totalTransactions = [];
        let total = 0;

        console.log("===+++", req.query.userId)

        if (req.query.userId) {
            totalTransactions = await Transaction.find({ User_id: req.query.userId }).populate("User_id", "Name Phone avatar _id").sort({ _id: -1 }).limit(PAGE_SIZE).skip(PAGE_SIZE * page);
            total = await User.countDocuments({ _id: req.query.userId });
        } else {
            totalTransactions = await Transaction.find({}).populate("User_id", "Name Phone avatar _id").sort({ _id: -1 }).limit(PAGE_SIZE).skip(PAGE_SIZE * page);
            total = await User.countDocuments({});
        }


        console.log(total, totalTransactions)
        res.status(200).send({ totalPages: Math.ceil(total / PAGE_SIZE), totalTransactions })

    } catch (e) {
        console.log(e, "=====++");
        res.status(400).send(e)
    }
})




//view all user with react paginate
// router.get("/User/all", Auth, async (req, res) => {
//     const searchq = req.query._q;
//     const searchtype = req.query._stype;
//     const PAGE_SIZE = req.query._limit;
//     let page =(req.query.page==0)? 0 : parseInt(req.query.page-1);
//     try {
//         let query ={};
//         if(searchq!=0 && searchtype !=0){
//             page = parseInt("0");
//             query[searchtype] = (searchtype==='Phone' || searchtype==='_id')? searchq : new RegExp('.*' + searchq + '.*')
//         }else{
//             query = {};
//         }

//         const total = await User.countDocuments(query);
//         const admin = await User.find(query).where("user_type").ne("Admin").sort({ updatedAt: -1 }).limit(PAGE_SIZE).skip(PAGE_SIZE * page);

//         res.status(200).send({totalPages: Math.ceil(total / PAGE_SIZE), admin})

//     } catch (e) {
//         res.status(400).send(e)
//     }
// })

//view all user with react paginate
router.get("/User/all", Auth, async (req, res) => {
    const searchq = req.query._q;
    // let searchq, searchtype, searchbystatus;
    const searchtype = req.query._stype;
    const PAGE_SIZE = req.query._limit;
    const searchbystatus = req.query._status;
    const searchbyUser = req.query._Userstatus;

    let page = (req.query.page == 0) ? 0 : parseInt(req.query.page - 1);

    try {
        let query = {};
        let total;
        let admin;
        query = await handleQuery(req, {})

        if (searchbyUser) {
            query.verified = searchbyUser
            total = await User.countDocuments(query);
            admin = await User.find(query).where("user_type").nin(['Admin', 'Agent']).populate("action_by").sort({ updatedAt: -1 }).limit(PAGE_SIZE).skip(PAGE_SIZE * page);
        }

        if (searchq != 0 && searchtype != 0 && searchbystatus == 0) {
            page = parseInt("0");
            query[searchtype] = (searchtype === 'Phone' || searchtype === '_id' || searchtype === 'createdAt') ? searchq : new RegExp(searchq, 'i')
            if (searchtype === 'Phone') {
                delete query[searchtype]
            }
            total = await User.countDocuments(query);
            admin = await User.find(query).where("user_type").nin(['Admin', 'Agent']).populate("action_by").sort({ updatedAt: -1 }).limit(PAGE_SIZE).skip(PAGE_SIZE * page);
            if (searchtype === 'Phone') {
                ({ total, admin } = await handleSearchingPhone(admin, searchq))
            }
        } else if (searchbystatus != 0 && searchbystatus != 'Block' && searchbystatus != 'hold_balance' && searchq == 0 && searchtype == 0) {
            total = await User.countDocuments({ query, verified: searchbystatus });
            admin = await User.find({ query, verified: searchbystatus }).where("user_type").nin(['Admin', 'Agent']).populate("action_by").sort({ updatedAt: -1 }).limit(PAGE_SIZE).skip(PAGE_SIZE * page).lean();
        }
        else if (searchbystatus != 0 && searchbystatus == 'Block' && searchbystatus != 'hold_balance' && searchq == 0 && searchtype == 0) {

            total = await User.countDocuments({ query, user_type: searchbystatus });
            admin = await User.find({ query, user_type: searchbystatus }).where("user_type").nin(['Admin', 'Agent']).populate("action_by").sort({ updatedAt: -1 }).limit(PAGE_SIZE).skip(PAGE_SIZE * page).lean();
        }
        else if (searchbystatus != 0 && searchbystatus == 'hold_balance' && searchq == 0 && searchtype == 0) {

            total = await User.countDocuments({ hold_balance: { $gt: 0 } });
            admin = await User.find({ hold_balance: { $gt: 0 } }).where("user_type").nin(['Admin', 'Agent']).populate("action_by").sort({ updatedAt: -1 }).limit(PAGE_SIZE).skip(PAGE_SIZE * page).lean();
        }
        else {
            total = await User.countDocuments(query).where("user_type").nin(['Admin', 'Agent']);
            admin = await User.find(query).where("user_type").nin(['Admin', 'Agent']).populate("action_by").sort({ updatedAt: -1 }).limit(PAGE_SIZE).skip(PAGE_SIZE * page).lean();
        }
        for (let i = 0; i < admin?.length; i++) {
            // const obj = { ...admin[i] }
            let earning = 0;
            const totalEarning = await ReferralHis.find({ referral_code: admin[i]?.referral_code }).sort({ createdAt: -1 })
            const data = (await User.find({ referral: admin[i]?.referral_code }).sort({ createdAt: -1 })).length;
            totalEarning?.map(item => {
                if (item.amount) earning += +totalEarning.amount
            })
            admin[i].referralLength = data
            admin[i].referralEarning = earning
            // arr.push(obj)
        }

        // total = await User.countDocuments(query).where("user_type").nin(['Admin', 'Agent']);
        // admin = await User.find(query).where("user_type").nin(['Admin', 'Agent']).populate("action_by").sort({ updatedAt: -1 }).limit(PAGE_SIZE).skip(PAGE_SIZE * page);

        res.status(200).send({ totalPages: total ? Math.ceil(total / PAGE_SIZE) : 0, admin })

    } catch (e) {
        console.log(e.message)
        res.status(400).send(e)
    }
})


router.get("/count/rejected/deposit", Auth, async (req, res) => {
    try {
        const countDeposit = await Transaction.find({
            $and: [
                { Req_type: "deposit" },
                { status: "FAILED" }
            ]
        }).countDocuments();
        let total = parseInt(countDeposit);
        res.status(200).send({ "count": total });
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
                { Req_type: "withdraw" },
                { status: "SUCCESS" },
            ]
        })
        const countTotal = await Transaction.find({
            $and: [
                { Req_type: "withdraw" },
            ]
        }).countDocuments();
        let total = 0
        data.forEach((item) => {
            total += item.amount
        })
        res.status(200).send({ "data": total, "count": countTotal })
        // console.log(ress);
    } catch (e) {
        res.status(400).send(e)
        console.log(e);
    }
})

router.get("/count/new/withdrawl", Auth, async (req, res) => {
    try {
        const countDeposit = await Transaction.find({
            $and: [
                { Req_type: "withdraw" },
                { status: "Pending" }
            ]
        }).countDocuments();
        let total = parseInt(countDeposit);
        res.status(200).send({ "count": total });
        // console.log(ress);
    } catch (e) {
        res.status(400).send(e)
        console.log(e);
    }
})

router.get("/count/rejected/withdrawl", Auth, async (req, res) => {
    try {
        const countDeposit = await Transaction.find({
            $and: [
                { Req_type: "withdraw" },
                { status: "reject" }
            ]
        }).countDocuments();
        let total = parseInt(countDeposit);
        res.status(200).send({ "count": total });
        // console.log(ress);
    } catch (e) {
        res.status(400).send(e)
        console.log(e);
    }
})


router.patch('/admin/edit/user/:id', Auth, RoleBase('Admin'), async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true })
        res.send(user);
    } catch (error) {
        res.status(400).send(error);
    }
})
// router.patch('/user/edit', Auth, async (req, res) => {
//     try {
//         if (req.body.referral) {
//             const Exist = await User.find({ referral_code: req.body.referral });
//             if (Exist.length == 1) {
//                 const order = await User.findByIdAndUpdate(req.user._id, req.body, { new: true })
//                 res.status(200).send({ msg: 'Referral submited successfully', submit: true })
//             }
//             else {
//                 res.status(200).send({ msg: 'Invalid referral Code', submit: false });
//             }
//         }
//         else if(req.body.bankDetails){
//             try {
//                 const user = await User.findByIdAndUpdate(req.user._id, req.body, { new: true })
//                 // beneficiery crud operation
//                 const config = {
//                     Payouts:{
//                   ClientID: "CF217991CB3DEFUD94MM84223P3G",
//                   ClientSecret: "4fdeb33d0a4cecc3ad2975e83fe026f8377d487e",
//                   ENV: "PRODUCTION", 
//                     }
//                 };

//                 const cfSdk = require('cashfree-sdk');
//                 const {Payouts} = cfSdk;
//                 const {Beneficiary} = Payouts;
//                 const handleResponse = (response) => {
//                     if(response.status === "ERROR"){
//                         throw {name: "handle response error", message: "error returned"};
//                     }
//                 }
//                 const bene = {
//                     "beneId": user._id, 
//                     "name": user.Name,
//                     "email": "demo@gmail.com", 
//                     "phone": user.Phone,
//                     "bankAccount": user.account_number,
//                     "ifsc": user.ifsc_code,    
//                     "address1" : "ABC Street", 
//                     "city": "Bangalore", 
//                     "state":"Karnataka", 
//                     "pincode": "560001",
//                     "vpa":user.upi_id
//                 };
//                     Payouts.Init(config.Payouts);
//                     const response = await Beneficiary.GetDetails({
//                         "beneId": bene.beneId,
//                     });
//                     if(response.status === 'ERROR' && response.subCode === '404' && response.message === 'Beneficiary does not exist'){
//                             const response1 = await Beneficiary.Add(bene);
//                             res.status(200).send(response1);
//                             handleResponse(response1);
//                     }
//                     else{
//                             const response = await Beneficiary.Remove({"beneId": bene.beneId});
//                             handleResponse(response);
//                             const response1 = await Beneficiary.Add(bene);
//                             res.status(200).send(response1);
//                             handleResponse(response1);
//                     }
//             }
//             catch(e) {
//                 // console.log(e)
//                 res.status(200).send({ msg: 'something went wrong', submit: false });
//             }
//         }
//         else {
//             if(req.body.Name)
//             {
//                 const user=await User.findOne({Name:req.body.Name});
//                 if(user)
//                 {
//                     return res.send("User name already exist!");
//                 }
//                 else{
//                     const order = await User.findByIdAndUpdate(req.user._id ,req.body, { new: true })
//                     res.status(200).send(order)
//                 }
//             }
//             else{
//                 const order = await User.findByIdAndUpdate(req.user._id ,req.body, { new: true })
//                 res.status(200).send(order)
//             }
//         }
//     } catch (e) {
//         console.log(e)
//     }
// })
router.patch('/user/edit', Auth, async (req, res) => {
    try {
        if (req.body.referral) {
            const Exist = await User.find({ referral_code: req.body.referral });
            if (Exist.length == 1 && req.user.referral_code != req.body.referral) {
                const order = await User.findByIdAndUpdate(req.user._id, req.body, { new: true })
                res.status(200).send({ msg: 'Referral submited successfully', submit: true })
            }
            else {
                res.status(200).send({ msg: 'Invalid referral Code', submit: false });
            }
        }
        else if (req.body.bankDetails) {
            try {
                const user = await User.findByIdAndUpdate(req.user._id, req.body, { new: true })
                // beneficiery crud operation
                /* const config = {
                    Payouts: {
                        ClientID: "CF217991CB3DEFUD94MM84223P3G",
                        ClientSecret: "4fdeb33d0a4cecc3ad2975e83fe026f8377d487e",
                        //   pathToPublicKey: '/public/accountId_15720_public_key.pem',
                        // publicKey: "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAoZh3aD0zIHBm24h9Q0SWSCko3pHbYjxBbg/8YEXN7n0UVh7zKl3mzV+FeeEW9tQNtMFtnmiPGsRG6Z6lgycchisECtQVMx8E9oAyxcUEa/qK1IDLK6cZIh47IIZw2g7iCrO+bnZITKXUigTbYWLcM0I2y3DsoHRA3kBBg/oAeC/35evTHh59sEVVn+hxWoS330NhgQuupiFqfnu3d+UUTzm3CBcr9znhFNh6RWz3T2XyKL3/u7qJXr0xTLpwlJ9aHi3XA4xJg8Fr5D3S6ZZQJxoiQuh/3UlAn3kGEbmSq0jGnkHEznkwvYKX3r+aAvGEaezCUrBov3+I1UzNxmD7bQIDAQAB",
                        ENV: "PRODUCTION",
                    }
                };

                const cfSdk = require('cashfree-sdk');
                const { Payouts } = cfSdk;
                const { Beneficiary } = Payouts;
                const handleResponse = (response) => {
                    if (response.status === "ERROR") {
                        throw { name: "handle response error", message: "error returned" };
                    }
                }
                const bene = {
                    "beneId": user._id,
                    "name": user.Name,
                    "email": "demo@gmail.com",
                    "phone": user.Phone,
                    "bankAccount": user.account_number,
                    "ifsc": user.ifsc_code,
                    "address1": "ABC Street",
                    "city": "Bangalore",
                    "state": "Karnataka",
                    "pincode": "560001",
                    "vpa": user.upi_id
                };
                //Get Beneficiary details
                Payouts.Init(config.Payouts);
                const response = await Beneficiary.GetDetails({
                    "beneId": bene.beneId,
                });
                if (response.status === 'ERROR' && response.subCode === '404' && response.message === 'Beneficiary does not exist') {
                    console.log('add new benn');
                    const response1 = await Beneficiary.Add(bene);
                    console.log("beneficiarry addition response", response1);
                    res.status(200).send(response1);
                    handleResponse(response1);
                }
                else {
                    const response = await Beneficiary.Remove({ "beneId": bene.beneId });
                    handleResponse(response);
                    const response1 = await Beneficiary.Add(bene);
                    console.log("beneficiarry addition response");
                    res.status(200).send(response1);
                    handleResponse(response1);
                } */
                res.status(200).send({ msg: 'Details updated successfully', subCode: '200', submit: true });
            }
            catch (e) {
                console.log(e)
                res.status(200).send({ msg: 'something went wrong', submit: false });
            }
        }
        else {
            if (req.body.Name) {
                var message = req.body.Name.trim();
                var cleaned = profanity.maskBadWords(message.toString());
                req.body.Name = cleaned;

                const user = await User.findOne({ Name: req.body.Name });
                if (user) {
                    return res.send("User name already exist!");
                }
                else {
                    const updates = Object.keys(req.body)
                    const allowupdates = ["Name", "Password", "avatar", "Phone", "Email", "Referred_By", "referral_code", "referral"]

                    const isValidUpdate = updates.every((update) => {
                        allowupdates.includes(update)

                    })

                    if (isValidUpdate) {
                        return res.send("Invalid Update");
                    }
                    const user = await User.findById(req.user._id)
                    updates.forEach((update) => {
                        user[update] = req.body[update]
                    })

                    await user.save()
                    res.status(200).send(user)
                }
            }
            else {
                const updates = Object.keys(req.body)
                const allowupdates = ["Name", "Password", "avatar", "Phone", "Email", "Referred_By", "referral_code", "referral"]

                const isValidUpdate = updates.every((update) => {
                    allowupdates.includes(update)

                })

                if (!isValidUpdate) {
                    return res.send("Invalid Update");
                }
                const user = await User.findById(req.user._id)
                updates.forEach((update) => {
                    user[update] = req.body[update]
                })

                await user.save()
                res.status(200).send(user)
            }
        }
    } catch (e) {
        console.log(e)
        // res.status(400).send(e)
    }
})

router.post('/logout', Auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()

        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/logoutAll', Auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send("logout")
    } catch (e) {
        res.status(500).send(e)
    }
})

router.post('/logoutAllUsers', async (req, res) => {
    try {

        //req.user.tokens = []
        //verified: 'unverified',
        const updateDoc = {
            $set: {
                avatar: "",
            },
        };
        await User.updateMany(updateDoc)
        res.send("logout")
    } catch (e) {
        res.status(500).send(e)
    }
})

router.post('/referral/to/wallet', Auth, async (req, res) => {
    try {
        const amount = req.body.amount;
        const user = await User.findById(req.user.id);
        const txn = new Transaction();
        if (amount <= user.referral_wallet) {
            user.Wallet_balance += amount;
            user.withdrawAmount += amount;
            user.referral_wallet -= amount;

            txn.amount = amount;
            txn.User_id = user._id;
            txn.Req_type = 'deposit';
            txn.Withdraw_type = 'referral';
            txn.payment_gatway = 'referral_wallet';
            txn.status = 'PAID';
            txn.txn_msg = 'Referral wallet Reedem Succesfully';
            txn.closing_balance = user.Wallet_balance;

            txn.save();
            user.save();
            res.send({ msg: 'success' });
        }
        else {
            res.send({ msg: 'Invalid Amount' });
        }
    } catch (e) {
        res.status(500).send(e)
    }
})

router.post("/changepassword", Auth, (req, res) => {
    const { Password, newPassword, confirmNewPassword } = req.body;
    const userID = req.user.id;

    if (!Password || !newPassword || !confirmNewPassword) {
        res.send({ msg: "Please fill in all fields." });
    }
    //Check passwords match

    if (newPassword !== confirmNewPassword) {
        res.send({ msg: "New passwords do not match." });
    } else {
        User.findOne({ _id: userID }).then((user) => {
            bcrypt.compare(Password, user.Password, (err, isMatch) => {
                if (err) throw err;
                if (isMatch) {

                    bcrypt.hash(newPassword, 10, (err, hash) => {
                        if (err) throw err;
                        user.Password = hash;
                        user.save();
                    });
                    res.status(200).send({ status: "true", massage: "password chnage" });
                } else {
                    res.send({ msg: "Current password is not a match." });
                }
            });
        });
    }
});
router.post("/changepasswordForOthers",Auth, (req, res) => {
    const {userID,newPassword, confirmNewPassword } = req.body;

    if (!newPassword || !confirmNewPassword) {
        res.send({ msg: "Please fill in all fields." });
    }
    //Check passwords match

    if (newPassword !== confirmNewPassword) {
        res.send({ msg: "New passwords do not match." });
    } else {
        User.findOne({ _id: userID }).then((user) => {
            bcrypt.hash(newPassword, 10, (err, hash) => {
                if (err) throw err;
                user.Password = hash;
                user.save();
            });
            res.status(200).send({ status: "true", massage: "password chnage" });
        });
    }
});


router.get("/me", Auth, async (req, res) => {
    try {
        console.log("------------------------------")
        const user = await User.findById(req.user.id)
        console.log("------------------------------", user)

        res.send(user)

    } catch (e) {
        res.status(400).send(e)
    }
})

router.post("/update-device-token", Auth, async (req, res) => {
    try {

        const { deviceToken } = req.body;
        const user = await User.findById(req.user.id);
        user.deviceToken = deviceToken;
        await user.save();

        res.send(user)

    } catch (e) {
        res.status(400).send(e)
    }
})


// router.post("/notification-user", Auth, async (req, res) => {
//     try {

//         const { title,body } = req.body
//         const users = await User.find({OTP_verified:true});
//         let deviceTokens=[];
//         let userNotifications=[];
//         users.map((user) =>{
//             if(user.deviceToken){
//                 deviceTokens.push(user.deviceToken);
//                 userNotifications.push({User_id:user._id,title,body})
//             }
//         })


//         let MSG = {
//             registration_ids:deviceTokens,
//             // to:"cJmByaESAFE2mL-5ADuz6Z:APA91bEejE-YJbgSjOJ4rbyPfSIonBe6BGjZeDMhX-yTkFT5TAuGE-8QcEDRUE5WNeAIigUyRxQS9gAwHJWOoHoOZ7fZrN09diyHI2JcMkG6KfKE_JvQ2T0uy4zJYJfkMLgz-cAtqDyy",
//             "notification": {
//                 "sound": "default",
//                 "title": `${title}`,
//                 "body": `${body}`,
//             }

//         }


//             await Notification.insertMany(userNotifications);


//             fcm.send(MSG, function (err, response) {
//                 if (err) {
//                     console.log('Something has gone wrong!' + err);
//                 } else {
//                     console.log('Successfully sent with response: ', response);
//                 }
//             });

//         res.send('Success')

//     } catch (e) {
//         res.status(400).send(e)
//     }
// })



// router.get("/notification-list", Auth, async (req, res) => {
//     try {

//         const notifications = await Notification.find({User_id:req.user._id}).lean()
//         res.send(notifications)

//     } catch (e) {
//         res.status(400).send(e)
//     }
// })



router.post("/login/admin", async (req, res) => {
    const phone = req.body.Phone;
    console.log("_____________________________phone_____________________________________", phone)
    const SecretCode = twofactor.generateSecret({ Phone: phone });
    const newSecret = twofactor.generateToken(SecretCode.secret);
    console.log(newSecret.token);

    try {
        let user = await User.findOne({ Phone: phone, user_type: "Admin" });

        if (!user) {
            user = await User.findOne({ Phone: phone, user_type: "Agent" });
        }
        //   if(phone == '99099099'){
        //     var otpmobile = '9413363519';
        //   }else{
        //     var otpmobile = '9413363519';
        //   }
        user.otp = newSecret.token;
        user.save();

        //    https.get(`https://www.fast2sms.com/dev/bulkV2?authorization=qsU9nRONbHKCzX0olIA2L65iTuYafv7VeQJkjE3Wgcy8pBtrPG3TRS7fvxjPq9LelZXWGCOkAwYu8MiJ&variables_values=${newSecret.token}&route=otp&numbers=${phone}`, (resp) => {
        //         console.log("send");
        //     })  


        return res.json({
            status: 200, // Custom Status for Inbuild Use Says That 2fa Authentication is required
            msg: "Authentication Required",
            secret: SecretCode.secret,
        });
    } catch (err) {
        console.error(err);
        res.status(401).send("Invalid Details");
    }
});

router.post("/login/admin/finish", async (req, res) => {
    console.log("finish call ghaov (Admin) 👍");
    const { Phone, twofactor_code, secretCode } = req.body;
    console.log("secredt key>>>>>>>>>>>>>>>>>>>>>>", Phone, twofactor_code, secretCode);
    try {
        let user = await User.findOne({ Phone: Phone, user_type: "Admin" });
        if (!user) {
            user = await User.findOne({ Phone: Phone, user_type: "Agent" });
        }
        if (user != null) {
            //   if (user.otp != twofactor_code) {
            //     console.log("Invalid Two Factor Code");
            //     return res.send({ msg: "Invalid OTP", status: 101 });
            //   } 
            // else {


            bcrypt.compare(twofactor_code, user.Password, async (err, isMatch) => {
                if (err) throw err;
                if (isMatch) {

                    const token = await user.genAuthToken();
                    res.status(200).send({
                        status: 200,
                        msg: "login successful",
                        token,
                        user,
                    });

                } else {
                    res.send({ msg: "Current password is not a match." });
                }
            })

            // const matched = twofactor.verifyToken(secretCode, twofactor_code);
            // if (matched == null) {
            //   return res.json({ status: 101, msg: "Invalid OTP!" });
            // } else {
            //   console.log("match3d resuldt", matched.delta);

            //   //if(matched.delta==0){
            //     const token = await user.genAuthToken();
            //     res.status(200).send({
            //       status: 200,
            //       msg: "login successful",
            //       token,
            //       user,
            //     });
            // }
            // }
        }
    } catch (e) {
        res.status(400).send(e);
        console.log(e);
    }
});


// router.post("/login/admin", async (req, res) => {
//     const email = req.body.Email;
//     const phone = req.body.Phone;
//     const password = req.body.Password;
//     try {
//         let user = await User.findOne({ Phone: phone, user_type: "Admin" });

//     if (!user) {
//       user = await User.findOne({ Phone: phone, user_type: "Agent" });
//     }


//         const isMatch = await bcrypt.compare(password, user.Password);
//         if (!isMatch) {
//             return res.status(400).json({
//                 errors: [{ msg: "Invalid Credentials" }],
//             });
//         }
//         const token = await user.genAuthToken();
//         res.status(200).send({
//             status: "true",
//             msg: "login successful",
//             data: [token, user],
//         });
//     } catch (err) {
//         console.error(err);
//         res.status(401).send("Invalid Details");
//     }
// });


router.get("/referral/code/:id", Auth, async (req, res) => {
    try {
        const data = await User.find({ referral: req.params.id }).countDocuments()
        res.send(data.toString())
    } catch (e) {
        res.send(e)
    }
})


// router.post('/user/bonus/:id', Auth, async (req, res) => {
//     try {

//         const data = await User.findById(req.params.id)

//         if (req.query.wallet == "mainWallet") {
//             data.Wallet_balance += req.body.bonus
//             //data.withdrawAmount += req.body.bonus;
//         } else if (req.query.wallet == "wonWallet") {
//             data.withdrawAmount += req.body.bonus
//             // data.Wallet_balance += req.body.bonus

//             // data.wonAmount += req.body.bonus;
//             // data.totalBonus += req.body.bonus;
//         }
//         data.totalBonus += req.body.bonus;


//         data.save()

//         const txn = new Transaction();
//         txn.amount = req.body.bonus;
//         txn.User_id = req.params.id;
//         txn.Req_type = 'bonus';
//         txn.action_by = req.user._id;//Added By team
//         txn.closing_balance = data.Wallet_balance;
//         txn.status = 'Bonus by Admin';
//         txn.save();

//         //console.log('bonusadded: ',txn);
//         const order = await User.findByIdAndUpdate(req.params.id, { bonus: req.body.bonus }, { new: true })
//         res.status(200).send(order)
//     } catch (e) {
//         res.status(400).send(e)
//     }
// })

router.post('/user/bonus/:id', Auth, async (req, res) => {
    try {

        const data = await User.findById(req.params.id)

        if(req.query.wallet=="mainWallet" ){
            data.Wallet_balance += req.body.bonus
            //data.withdrawAmount += req.body.bonus;
            data.totalBonus += req.body.bonus;
        }else if(req.query.wallet=="wonWallet"){
            data.withdrawAmount += req.body.bonus
            data.Wallet_balance += req.body.bonus

            data.wonAmount += req.body.bonus;
            // data.totalBonus += req.body.bonus;
        }


        data.save()

        const txn = new Transaction();
        txn.amount = req.body.bonus;
        txn.User_id = req.params.id;
        txn.Req_type = 'bonus';
        txn.action_by = req.user._id;//Added By team
        txn.closing_balance = data.Wallet_balance;
        txn.status = 'Bonus by Admin';
        txn.save();
        
        //console.log('bonusadded: ',txn);
        const order = await User.findByIdAndUpdate(req.params.id, { bonus: req.body.bonus }, { new: true })
        res.status(200).send(order)
    } catch (e) {
        res.status(400).send(e)
    }
})


router.patch('/user/missmatch/clear/:id', async (req, res) => {
    try {
        const userData = await User.findById(req.params.id)

        const mismatchValue = userData.Wallet_balance + 2 * userData.totalPenalty - (((userData.wonAmount - userData.loseAmount) + userData.totalDeposit + userData.withdrawAmount + userData.referral_earning + userData.totalBonus) - 2 * (userData.totalWithdrawl + userData.referral_wallet + userData.withdraw_holdbalance + userData.hold_balance));
        if (mismatchValue < 0) {
            userData.Wallet_balance = (userData.Wallet_balance - (mismatchValue));
        }
        else if (mismatchValue > 0 && userData.Wallet_balance >= mismatchValue) {
            userData.Wallet_balance = (userData.Wallet_balance - mismatchValue);
        }
        userData.save();
        console.log(userData);

        res.status(200).send("Button was clicked")
    } catch (e) {
        res.status(400).send(e)
    }
})


router.patch('/user/Hold/clear/:id', async (req, res) => {
    try {
        const userData = await User.findById(req.params.id)

        let prevGame = await Game.find(
            {
                $or: [
                    { $and: [{ Status: "conflict" }, { Created_by: req.params.id }, { Creator_Status: null }] },
                    { $and: [{ Status: "conflict" }, { Accepetd_By: req.params.id }, { Acceptor_status: null }] },

                ],

            }
        )

        if (prevGame.length == 0) {
            prevGame = await Game.find(
                {
                    $or: [
                        { $and: [{ Status: "pending" }, { Created_by: req.params.id }, { Creator_Status: null }] },
                        { $and: [{ Status: "pending" }, { Accepetd_By: req.params.id }, { Acceptor_status: null }] },
                    ],

                }
            )

        }
        if (prevGame.length == 0) {
            prevGame = await Game.find(
                {
                    $or: [
                        { $and: [{ Status: "running" }, { Created_by: req.params.id }] },
                        { $and: [{ Status: "running" }, { Accepetd_By: req.params.id }] },

                    ],
                }
            )

        }
        if (prevGame.length == 0) {
            prevGame = await Game.find(
                {
                    $or: [
                        { $and: [{ Status: "new" }, { Created_by: req.params.id }] },
                        { $and: [{ Status: "new" }, { Accepetd_By: req.params.id }] },

                    ],
                }
            )

        }
        //console.log('hold reove check',prevGame);
        if (prevGame.length == 0 && userData.hold_balance > 0) {
            userData.Wallet_balance = (userData.Wallet_balance + userData.hold_balance);
            userData.hold_balance = 0;

            userData.save();
            res.status(200).send("hold Button was clicked")
        } else {
            res.status(200).send("Check enrolled games")
        }

        // console.log(userData);


    } catch (e) {
        res.status(400).send(e)
    }
})



router.post('/user/penlaty/:id', Auth, async (req, res) => {
    try {
        const data = await User.findById(req.params.id)
        if (req.body.bonus <= data.Wallet_balance) {
            if (req.query.wallet == "mainWallet") {
                data.Wallet_balance -= req.body.bonus;
                // data.totalDeposit-=req.body.bonus;
            } else if (req.query.wallet == "wonWallet" && data.withdrawAmount >= req.body.bonus) {
                // data.Wallet_balance -= req.body.bonus;
                // data.wonAmount -= req.body.bonus;
                data.withdrawAmount -= req.body.bonus;
            } else {
                return res.status(200).send({ 'status': 0 })
            }


            data.totalPenalty += req.body.bonus;

            if (data.withdrawAmount < 0) {
                data.withdrawAmount = 0;
            }
            const txn = new Transaction();
            txn.amount = req.body.bonus;
            txn.User_id = req.params.id;
            txn.Req_type = 'penalty';
            txn.action_by = req.user._id;//Added By team
            // txn.Withdraw_type = req.body.type;
            txn.closing_balance = data.Wallet_balance;
            txn.status = 'Penalty by Admin';
            txn.save();

            data.save()
            const transac = new myTransaction({
                User_id: req.params.id,
                Amount: req.body.bonus,
                Remark: "Penalty by Admin"
            });
            await transac.save()
            res.status(200).send(data)
        } else {
            res.status(200).send({ 'status': 0 })
        }
    } catch (e) {
        res.status(400).send(e)
    }
})



router.post('/block/user/:id', Auth, async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        user.user_type = req.body.user_type
        user.action_by = req.user._id//Added By team
        user.tokens = []
        user.save()

        res.send("user block")
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/website/setting', async (req, res) => {
    const paymentGateway = await GatewaySettings.findOne();

    //console.log('gatway RazorPayKey',paymentGateway.RazorPayKey);
    //console.log('gatway RazorPaySecretKey',paymentGateway.RazorPaySecretKey);
    //console.log('gatway AccountName',paymentGateway.AccountName);
    const webSetting = {
        'isCashFreeActive': false,
        'isPhonePeActive': false,
        'isRazorPayActive': false,
        'isDecentroActive': false,
        'isManualPaymentActive': false,
        'isManualUPIQR': '', //paymentGateway.QRcode,
        'isUpiGatewayActive': false,

        'isManualPayoutActive': false,
        'isCashFreePayoutActive': false,
        'isRazorPayPayoutActive': false,
        'isDecentroPayoutActive': false,
        'maxAutopayAmt': 1500,

        'RazorPayKey': 'rzp_test_TF4g8dFj5CY16x',
        'RazorPaySecretKey': 'ZiQZdaTqC6G0mOGkUfe927n9',
        'AccountName': 'ludo-khelo',

        'isDecentroPayoutAuto': false,
        'isRazorPayPayoutAuto': false,
    }
    //console.log('webSetting ',webSetting);
    res.send(webSetting)
})


module.exports = router


async function getAccessToken() {
    return { access_token: 'eyJhbGciOiJIUzUxMiJ9.eyJhdWQiOiJBUEkiLCJyZWZyZXNoX3Rva2VuIjoiZXlKaGJHY2lPaUpJVXpVeE1pSjkuZXlKaGRXUWlPaUpCVUVraUxDSnpkV0lpT2lKc2RXUnZhMmhsYkc4d05FQm5iV0ZwYkM1amIyMGlMQ0poY0dsZmEyVjVJam9pYTJWNVgyeHBkbVZmYzNKcVZERkliRTFSUlhKTWJHVktVa3BZTW0xcmVURkNXbk5SY0c1Tlpta2lMQ0pwYzNNaU9pSmhjR2t1YzJGdVpHSnZlQzVqYnk1cGJpSXNJbVY0Y0NJNk1UY3lPRE01TVRJNE1pd2lhVzUwWlc1MElqb2lVa1ZHVWtWVFNGOVVUMHRGVGlJc0ltbGhkQ0k2TVRZNU5qYzJPRGc0TW4wLlpyay1PRFFNNUtnak92MG50NWY1LWZMY28wTnNnd3hlVW9lSVF3WXh3QThsWEcyVk1zYV9hNjFKbUVITVpwWk1FQkFwN2t6b2o2LXRBZ0RXMFJDTVhnIiwic3ViIjoibHVkb2toZWxvMDRAZ21haWwuY29tIiwiYXBpX2tleSI6ImtleV9saXZlX3NyalQxSGxNUUVyTGxlSlJKWDJta3kxQlpzUXBuTWZpIiwiaXNzIjoiYXBpLnNhbmRib3guY28uaW4iLCJleHAiOjE2OTY4NTUyODIsImludGVudCI6IkFDQ0VTU19UT0tFTiIsImlhdCI6MTY5Njc2ODg4Mn0.ban69Bay7DliUZud7XFzNs7MWcxuu1zaGksw83UedZ4dYQBDwwTb4QwZAnkGfze0Mq-_xc_nxhIhw6EmF_pToQ' }
}


function __request(options) {

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (error) {
                console.error('Error occurred while calling the API:', error.message);
                reject(error);
            } else {
                let result = JSON.parse(body)
                resolve(result);
            }
        });
    });

}

async function handleQuery(req, obj = {}) {
    const { startDate, endDate } = req.query;
    const enddate = moment(endDate).endOf('day')

    if (startDate && endDate) {
        obj.createdAt = {
            $gte: new Date(startDate),
            $lte: new Date(enddate)
        }

    } else if (startDate && !endDate) {
        obj.createdAt = {
            $gte: new Date(startDate),
            $lte: new Date(Date.now())
        }
    } else if (!startDate && endDate) {
        obj.createdAt = {
            $lte: new Date(enddate)
        }
    }

    return obj;
}

async function handleSearchingPhone(data, keyword, abcd) {
    // Assume numberValue is retrieved from the database.
    const adminData = data?.map(item => {
        return { ...item._doc, Phone: item.Phone.toString() }
    })
    console.log(adminData)
    // Search for the pattern '89' using a regular expression
    const pattern = new RegExp(keyword.toString(), 'g');
    const adminDat1 = adminData.filter(obj => pattern.test(obj['Phone']));
    return { admin: adminDat1, total: adminDat1.length };

}
