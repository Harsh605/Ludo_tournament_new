// const { log } = require("firebase-functions/logger")
const router = require("express").Router()

const Auth = require("../Middleware/Auth")
const TermCon = require("../Model/staticpage")

router.post("/term/condition", async (req, res) => {

    const { Desc, Type } = req.body
    console.log();

    try {

        const data = new TermCon(
            req.body
        )
        data.save()
        res.send(data)

    } catch (e) {
        res.send(e)
        console.log(e);
    }

})
router.post("/term/condition/:Type", async (req, res) => {
    try {
        let data = await TermCon.find({ Type: req.params.Type });
        data = data[0]
        console.log(data, req.body.Desc)
        data.Desc = req.body.Desc;
        data.save();
        res.send(data)
    } catch (e) {
        res.send(e)
        console.log(e);
    }

})
router.get("/term/condition/:Type", async (req, res) => {
    try {
        const data = await TermCon.find({ Type: req.params.Type })
        res.send(data)

    } catch (e) {
        res.send(e)
        console.log(e);
    }

})
router.get("/term/condition/term-condition", async (req, res) => {
    try {
        const data = await TermCon.findOne({ Type: "term-condition" })
        res.send(data)
    } catch (e) {
        res.send(e)
        console.log(e);
    }
})
router.get("/term/condition/Privacy_Policy", async (req, res) => {
    try {
        const data = await TermCon.findOne({ Type: "Privacy_Policy" })
        res.send(data)
    } catch (e) {
        res.send(e)
        console.log(e);
    }
})
router.get("/term/condition/Game_Rules", async (req, res) => {
    try {
        const data = await TermCon.findOne({ Type: "Game_Rules" })
        res.send(data)
    } catch (e) {
        res.send(e)
        console.log(e);
    }
})
router.get("/term/condition/About-Us", async (req, res) => {
    try {
        const data = await TermCon.findOne({ Type: "About-Us" })
        res.send(data)
    } catch (e) {
        res.send(e)
        console.log(e);
    }
})
router.get("/term/condition/Refund_Policy", async (req, res) => {
    try {
        const data = await TermCon.findOne({ Type: "Refund_Policy" })
        res.send(data)
    } catch (e) {
        res.send(e)
        console.log(e);
    }
})

module.exports = router