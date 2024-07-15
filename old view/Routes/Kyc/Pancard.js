const router = require('express').Router()
const multer = require('multer')
const Auth = require('../../Middleware/Auth')
const path = require("path")
const PanCard = require("../../Model/Kyc/PanCard")


const storage = multer.diskStorage({
    destination: function (req, file, cd) {
        cd(null, "public")
    },
    filename: function (req, file, cd) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cd(null, uniqueSuffix + path.extname(file.originalname))
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
        fileSize: 15 * 1024 * 1024 // 5MB
    }
})


router.post("/pancard", Auth, upload.single("docs"), async (req, res) => {
    const { Name, FatherName, DOB, Gender, Number } = req.body
    try {
        const pancard = new PanCard({
            Name,
            FatherName,
            DOB,
            Gender,
            Number,
            docs: req.file.filename,
            User: req.user.id
        })
        pancard.save()
        res.send(pancard)
        console.log(pancard);
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get("/pancard/:id", Auth, async (req, res) => {
    await PanCard.findById(req.params.id).then((ress) => {
        res.status(200).send(ress)
        // console.log(ress);
    }).catch((e) => {
        res.status(400).send(e)
    })
})


module.exports = router