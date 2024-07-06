const router = require("express").Router()
const Auth = require("../Middleware/Auth")
const AdminEarning = require("../Model/AdminEaring")


router.post("/Admin/Earning", async (req, res) => {
    const { Game_id, Ammount, Earned_Form } = req.body

    try {
        const game = new AdminEarning({
            Game_id,
            Ammount,
            Earned_Form,
        })

        game.save()
        res.send(game)
    } catch (e) {
        res.status(400).send(e)
    }
})



router.get("/admin/Earning", Auth, async (req, res) => {
    const PAGE_SIZE = req.query._limit;
    // let FROM_DATE=req.query.FROM_DATE;
    // let TO_DATE=req.query.TO_DATE;
    let page = (req.query.page == 0) ? 0 : parseInt(req.query.page - 1);
    try {
        const total = await AdminEarning.countDocuments({});
        const admin = await AdminEarning.find({}).sort({ updatedAt: -1 }).populate('Earned_Form', 'Name').limit(PAGE_SIZE).skip(PAGE_SIZE * page)
        // const total = await AdminEarning.countDocuments({$and: [{createdAt: {"$gte": new Date(FROM_DATE), "$lt": new Date(TO_DATE)}}]});
        // const admin = await AdminEarning.find({$and:[{createdAt: {"$gte": new Date(FROM_DATE), "$lt": new Date(TO_DATE)}}]}).sort({ updatedAt: -1 }).limit(PAGE_SIZE).skip(PAGE_SIZE * page)
        //console.log( Math.ceil(total / PAGE_SIZE));
        res.status(200).send({ totalPages: Math.ceil(total / PAGE_SIZE), admin })
    } catch (e) {
        res.status(400).send(e)
    }
})


router.get("/admin/Earning/total", async (req, res) => {
    try {
        const admin = await AdminEarning.find()
        let total = 0;
        admin.forEach((item) => {
            total += item.Ammount;
        })

        res.status(200).send({ "total": total })
    } catch (e) {
        res.status(400).send(e)
    }
})

module.exports = router