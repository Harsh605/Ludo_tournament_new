const router = require("express").Router()
const Auth = require("../Middleware/Auth")
const Withdrawl = require("../Model/withdrawls")


router.post("/withdrawl",  async (req, res) => {
    const { withdrawl_ammount, upi_app, upi_id } = req.body

    try {
        const game = new Withdrawl({
            withdrawl_ammount,
            upi_app,
            upi_id,
            User_id: req.user.id
        })

        game.save()
        res.send(game)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get("/withdrawl/total",  async (req, res) => {
    try {
        const admin = await Withdrawl.find().countDocuments()

        res.status(200).send(admin.toString())

    } catch (e) {
        res.status(400).send(e)
    }
})


router.get("/withdrawl/success",  async (req, res) => {
    try {
        const admin = await Withdrawl.find({ Status: "success" }).countDocuments()

        res.status(200).send(admin.toString())

    } catch (e) {
        res.status(400).send(e)
    }
})

router.get("/withdrawl/pending",  async (req, res) => {
    try {
        const admin = await Withdrawl.find({ Status: "pending" }).countDocuments()

        res.status(200).send(admin.toString())

    } catch (e) {
        res.status(400).send(e)
    }
})
router.get("/withdrawl/rejected",  async (req, res) => {
    try {
        const admin = await Withdrawl.find({ Status: "rejected" }).countDocuments()

        res.status(200).send(admin.toString())

    } catch (e) {
        res.status(400).send(e)
    }
})

router.get("/withdrawl/all",  async (req, res) => {
    try {
        const admin = await Withdrawl.find()

        res.status(200).send(admin)

    } catch (e) {
        res.status(400).send(e)
    }
})

router.patch('/withdrawl/edit/:id',  async (req, res) => {
    try {
        const order = await Withdrawl.findByIdAndUpdate(req.params.id, req.body, { new: true })
        res.status(200).send(order)
    } catch (e) {
        res.status(400).send(e)
    }
})



module.exports = router