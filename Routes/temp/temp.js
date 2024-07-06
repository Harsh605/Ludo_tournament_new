const router = require('express').Router()
const multer = require('multer')
const Auth = require('../../Middleware/Auth')

const path = require("path")
const Temp = require('../../Model/temp/temp')
// const User = require("../../Model/User");
const User = require('../../Model/User')
const Transaction = require('../../Model/transaction')
const upiGatewayMyTransaction = require('../../Model/UpiGatewayTransction')
const RoleBase = require('../../Middleware/Role')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public")
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
})


const fileFilter = (req, file, cd) => {
    if (
        (file.mimetype === "image/jpg",
            file.mimetype === "image/jneg",
            file.mimetype === "image/png")
    ) {
        cd(null, true);
    } else {
        cd(null, false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fieldSize: 100000000
    }
})

router.post("/temp/deposite", Auth, upload.single("front"), async (req, res) => {
    const { amount, status, type } = req.body
    try {
        const aadharcard = new Temp({
            amount,
            front: req.file.path,
            user: req.user.id,
            status: "pending",
            Req_type: "deposit",
            type
        })
        aadharcard.save()
        res.send(aadharcard)
    }
    catch (e) {
        res.send(e)
        console.log(e);
    }
})


// router.get("/temp/deposite/:id", Auth, async (req, res) => {
//     await Transaction.find({ User_id: req.params.id }).sort({ createdAt: -1 }).then((ress) => {
//         res.status(200).send(ress)
//     //await Transaction.find({$and: [{ User_id: req.params.id}, {'status': {$ne : "Pending"}}]}).sort({ createdAt: -1 }).then((ress) => {
//         //res.status(200).send(ress)
//         // console.log(ress);
//     }).catch((e) => {
//         res.status(400).send(e)
//     })
// })

router.get("/temp/deposite/:id", Auth, async (req, res) => {
    const PAGE_SIZE = req.query._limit;
    const status = req.query._status;
    let page = (req.query.page == 0) ? 0 : parseInt(req.query.page - 1);
    let total = await Transaction.countDocuments({ User_id: req.params.id });
    await Transaction.find({ User_id: req.params.id }).sort({ updatedAt: -1 }).limit(PAGE_SIZE).skip(PAGE_SIZE * page).then((ress) => {
        res.status(200).send({ totalPages: Math.ceil(total / PAGE_SIZE), ress })
    }).catch((e) => {
        res.status(400).send(e)
    })
})

router.get("/temp/deposite", Auth, async (req, res) => {
    try {

        const PAGE_SIZE = req.query._limit;
        let page = (req.query.page == 0) ? 0 : parseInt(req.query.page - 1);
        const query = {}
        if (req.query._status) query.status = req.query._status
        total = await Temp.countDocuments({ Req_type: "deposit", ...query });

        const data = await Temp.find({
            Req_type: "deposit",
            ...query
        }).sort({ createdAt: -1 }).populate("user").limit(PAGE_SIZE).skip(PAGE_SIZE * page);
        console.log("abcddd")
        res.status(200).send({ totalPages: Math.ceil(total / PAGE_SIZE), data })
        // console.log(ress);
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get("/temp/deposit/pending", async (req, res) => {
    try {

        const data = await Temp.find({
            $and: [
                { Req_type: "deposit" },


                { status: "pending" }


            ]
        }).populate("user")
        res.status(200).send(data)
        // console.log(ress);
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get("/temp/deposit/all", Auth, async (req, res) => {
    try {

        const data = await Temp.find({
            $and: [
                { Req_type: "deposit" },



                { status: "success" }


            ]
        }).populate("user")
        res.status(200).send(data)
        // console.log(ress);
    } catch (e) {
        res.status(400).send(e)
    }
})



router.get("/temp/deposite/all/all/all", Auth, async (req, res) => {
    try {

        const data = await Temp.find().populate("user")
        res.status(200).send(data)
        // console.log(ress);
    } catch (e) {
        res.status(400).send(e)
    }
})



router.get("/temp/withdraw/all/all/all", Auth, async (req, res) => {
    try {

        const PAGE_SIZE = req.query._limit;
        let page = (req.query.page == 0) ? 0 : parseInt(req.query.page - 1);
        const query = {}
        if (req.query._status) query.status = req.query._status
        total = await Temp.countDocuments({ Req_type: "withdraw", ...query });

        const data = await Temp.find({
            Req_type: "withdraw",
            ...query
        }).populate("user").limit(PAGE_SIZE).skip(PAGE_SIZE * page);
        res.status(200).send({ totalPages: Math.ceil(total / PAGE_SIZE), data })
        // console.log(ress);
    } catch (e) {
        console.log("e", e.message)
        res.status(400).send(e)
    }
})
router.get("/temp/withdraw/all/pending", Auth, async (req, res) => {
    try {

        const data = await Temp.find({
            $and: [
                { Req_type: "withdraw" },
                { status: "Pending" }
            ]
        }).populate("user")
        res.status(200).send(data)
        // console.log(ress);
    } catch (e) {
        res.status(400).send(e)
    }
})


router.get("/temp/withdraw/all/success", async (req, res) => {
    try {

        const data = await Temp.find({

            $and: [
                {
                    Req_type: "withdraw"
                },
                {
                    $or: [
                        { status: "success" },
                        { status: "reject" }
                    ]
                }
            ]



        }).populate("user")
        res.status(200).send(data)
        // console.log(ress);
    } catch (e) {
        res.status(400).send(e)
    }
})

router.patch("/temp/deposite/:id", Auth, async (req, res) => {
    try {

        const txn = await Temp.findById(req.params.id)
        const txnr = await Transaction.findById(txn.txn_id)
        const user = await User.findById(txn.user);
        user.Wallet_balance += txn.amount;
        user.totalDeposit += txn.amount;
        txn.closing_balance = user.Wallet_balance;
        txn.status = 'success';
        txnr.status = 'success';
        txnr.save();
        txn.save();
        user.save();

        res.status(200).send(txn)
        // console.log(ress);
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post("/temp/withdraw", Auth, async (req, res) => {

    const { amount, upi, type, upi_no } = req.body
    try {
        const user = await User.findById(req.user.id);
        user.Wallet_balance -= amount;
        user.save();
        const aadharcard = new Temp({
            amount,
            upi,
            type,
            user: req.user.id,
            Req_type: 'withdraw',
            upi_no,
            closing_balance: user.Wallet_balance
        })
        aadharcard.save()
        res.send(aadharcard)
    }
    catch (e) {
        res.send(e)
        console.log(e);
    }
})


router.patch("/temp/withdraw/:id", Auth, async (req, res) => {
    try {
        const txn = await Temp.findById(req.params.id)
        txn.status = 'success';
        txn.save();
        res.status(200).send(txn)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.patch("/temp/withdrawreject/:id", async (req, res) => {
    try {
        const txn = await Temp.findById(req.params.id)
        txn.status = 'reject';
        txn.save();
        res.status(200).send(txn)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.patch("/temp/withdraw/reject/:id", Auth, async (req, res) => {
    try {
        const withdraw = await Temp.findById(req.params.id)
        const user = await User.findById(withdraw.user);
        if (user.withdraw_holdbalance > 0) {
            const txn = await Transaction.findById(withdraw.txn_id);
            if (txn.status === "FAILED" || txn.status === "SUCCESS") {

                if (txn.status === "FAILED") {
                    withdraw.closing_balance = withdraw.closing_balance + withdraw.amount;
                    withdraw.status = 'FAILED';
                } else {
                    withdraw.closing_balance = withdraw.closing_balance - withdraw.amount;
                    withdraw.status = 'SUCCESS';
                }

                withdraw.save();
            } else {
                user.Wallet_balance += withdraw.amount;
                user.withdrawAmount += withdraw.amount;
                user.withdraw_holdbalance -= withdraw.amount;

                withdraw.closing_balance = withdraw.closing_balance + withdraw.amount;
                withdraw.status = 'reject';
                withdraw.save();
                user.save();

                txn.status = "FAILED";
                txn.txn_msg = "Withdraw rejected";
                txn.closing_balance = txn.closing_balance + txn.amount;
                txn.save();
            }

            res.status(200).send(withdraw)
        }
        else {
            const txn = await Transaction.findById(withdraw.txn_id);
            if (txn.status != "SUCCESS" && withdraw.status == 'Pending') {

                txn.status = "FAILED";
                txn.txn_msg = "Technical Issue";
                txn.save();

                withdraw.closing_balance = withdraw.closing_balance + withdraw.amount;
                withdraw.status = 'FAILED';
                withdraw.save();
            }
            res.send({ message: 'Invalid request, withdraw_holdbalance low', error: true })
        }
    } catch (e) {
        res.status(400).send(e)
    }
})
router.patch("/temp/deposite/cancelled/:id", Auth, async (req, res) => {
    try {

        const txn = await Temp.findById(req.params.id)
        const user = await User.findById(txn.user);
        user.Wallet_balance -= txn.amount;
        txn.closing_balance = user.Wallet_balance;
        txn.status = 'pending';
        txn.save();
        user.save();

        res.status(200).send(txn)
        // console.log(ress);
    } catch (e) {
        res.status(400).send(e)
    }
})



router.delete("/temp/deposit/delete/:id", Auth, async (req, res) => {
    try {

        const ttxn = await Temp.findById(req.params.id)
        const data = await Temp.findByIdAndDelete({
            _id: req.params.id
        });
        const txn = await Transaction.findById(ttxn.txn_id);
        txn.status = "FAILED";
        txn.save();
        res.status(200).send("ok")
        // console.log(ress);
    } catch (e) {
        res.status(400).send(e)
    }
})




router.get("/upiGateway/deposit/history", Auth,RoleBase("Admin"), async (req, res) => {
    try {
        console.log(req.query)
        const page = parseInt(req.query.page) || 0;
        const rowsPerPage = parseInt(req.query.rowsPerPage) || 10;

        const transactions = await upiGatewayMyTransaction.find({})
        .sort({ createdAt: -1 })
            .skip(page * rowsPerPage)
            .limit(rowsPerPage);
        const totalRows = await upiGatewayMyTransaction.countDocuments({});
        res.status(200).send({ totalRows, transactions });
    } catch (e) {
        res.status(400).send(e);
    }
});
router.get("/upiGateway/deposit/myHistory", Auth, async (req, res) => {
    try {
        console.log(req.query)
        const page = parseInt(req.query.page) || 0;
        const rowsPerPage = parseInt(req.query.rowsPerPage) || 10;

        const transactions = await upiGatewayMyTransaction.find({User_id: req.user.id})
        .sort({ createdAt: -1 })
            .skip(page * rowsPerPage)
            .limit(rowsPerPage);
        const totalRows = await upiGatewayMyTransaction.countDocuments({User_id: req.user.id});
        res.status(200).send({ totalRows, transactions });
    } catch (e) {
        res.status(400).send(e);
    }
});

module.exports = router