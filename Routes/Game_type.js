const router = require("express").Router()
const multer = require("multer");
const Auth = require("../Middleware/Auth");
const GamePlay = require("../Model/Game_type")
const path = require("path")
var ObjectID = require('mongodb').ObjectID


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    },
});
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
        fileSize: 100000000000,
    },
});


router.post("/game/type", upload.single("file"), async (req, res) => {

    try {
        const game = new GamePlay({
            Game: req.body.Game,
            variant: req.body.variant
        })

        game.save()
        res.send(game)
    } catch (e) {
        res.status(400).send(e)
        console.log(e);
    }
})

router.get("/game/type/:id", async (req, res) => {
    try {
        const data = await GamePlay.aggregate([

            { $unwind: "$variant" },
            {
                $match: {
                    _id: new ObjectID(req.params.id)
                }
            }
        ])
        res.status(200).send(data)
    } catch (e) {
        res.status(400).send(e)
        // console.log(e);
    }

})

router.get("/game/type", async (req, res) => {
    try {
        const data = await GamePlay.find()
        res.status(200).send(data)
    } catch (e) {
        res.status(400).send(e)
    }

})


router.delete("/game/delete/:id", async (req, res) => {

    try {
        const data = await GamePlay.findByIdAndDelete(req.params.id)
        res.send(data)
    } catch (e) {
        res.send(e)
    }
})

module.exports = router