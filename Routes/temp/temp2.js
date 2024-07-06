const router = require('express').Router()

const Auth = require('../../Middleware/Auth')

// const Temp = require('../../Model/temp/temp2')
const Temp = require('../../Model/temp/temp')





router.get("/temp/withdraw/:id", Auth, async (req, res) => {
    await Temp.findById(req.params.id).then((ress) => {
        res.status(200).send(ress)
        // console.log(ress);
    }).catch((e) => {
        res.status(400).send(e)
    })
})
router.get("/temp/withdraw", Auth, async (req, res) => {
    try {

        const data = await Temp.find().populate("user")
        res.status(200).send(data)
        // console.log(ress);
    } catch (e) {
        res.status(400).send(e)
    }
})

router.patch("/temp/withdraw/:id", Auth, async (req, res) => {
    try {

        const data = await Temp.findByIdAndUpdate(req.params.id, req.body, { new: true })
        res.status(200).send(data)
        // console.log(ress);
    } catch (e) {
        res.status(400).send(e)
    }
})



module.exports = router