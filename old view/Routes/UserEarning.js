const router = require("express").Router()
const Auth = require("../Middleware/Auth")
const UserEarnin = require("../Model/UserEarning")


router.post("/User/Earning", async (req, res) => {
    const { Game_id, Ammount, Earned_Form, User_id } = req.body

    try {
        const game = new UserEarnin({
            Game_id,
            Ammount,
            Earned_Form,
            User_id: req.user.id
        })

        game.save()
        res.send(game)
    } catch (e) {
        res.status(400).send(e)
    }
})


module.exports = router