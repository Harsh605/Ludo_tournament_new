const router = require("express").Router()
const { route } = require("express/lib/application")
const Auth = require("../Middleware/Auth")
const myTransaction = require("../Model/myTransaction")
const User = require('../Model/User')

router.post("/myTransaction", async (req, res) => {
    const { Game_id, Remark, amount } = req.body
    try {
        const game = new myTransaction({
            Game_id,
            amount,
            Remark,
            User_id: req.user.id,

        })

        game.save()
        res.send(game)
    } catch (e) {
        res.status(400).send(e)
    }
})



router.patch('/myTransaction/bonus/:id',
    async (req, res) => {

        try {
            const user = await User.findById(req.params.id);
            const Wbalance = user.Wallet_balance;
            const totalBalance = Wbalance + req.body.amount;
            await User.findByIdAndUpdate(req.params.id, { Wallet_balance: totalBalance }, { new: true })
            const newVar = new myTransaction({ amount: req.body.amount, season: req.body.season, User_id: req.params.id });
            newVar.save();
            res.status(200).send(newVar)
        } catch (e) {

            res.status(400).send(e)
            console.log(e);
        }
    })

router.patch('/myTransaction/penalty/:id',
    async (req, res) => {

        try {
            const user = await User.findById(req.params.id);
            const Wbalance = user.Wallet_balance;
            const totalBalance = Wbalance - req.body.amount;
            await User.findByIdAndUpdate(req.params.id, { Wallet_balance: totalBalance }, { new: true })
            const newVar = new myTransaction({ amount: req.body.amount, season: req.body.season, User_id: req.params.id });
            newVar.save();
            res.status(200).send(newVar)
        } catch (e) {

            res.status(400).send(e)
            console.log(e);
        }
    })

router.get("/myTransaction/user/:id", Auth, async (req, res) => {

    const User_id = req.params.id
    const User2_id = req.params.id

    try {
        const my = await myTransaction.find({ $or: [{ User_id }, { User2_id }] }).populate("User_id").populate("User2_id")
        res.status(200).send(my)
    } catch (e) {
        res.send(e)
    }
})

module.exports = router