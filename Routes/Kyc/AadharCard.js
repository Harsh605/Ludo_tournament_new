const router = require('express').Router()
const multer = require('multer')
const moment = require('moment')
const Auth = require('../../Middleware/Auth')
const AadharCard = require('../../Model/Kyc/Aadharcard')
const path = require("path")
const User = require("../../Model/User")
const sharp = require("sharp")
const fs = require("fs")

const storage = multer.memoryStorage();
// const upload = multer({ storage });

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, "public/kycdoc")
//     },
//     filename: function (req, file, cb) {
//         const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//         cb(null, uniqueSuffix + path.extname(file.originalname));
//     }
// })

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

const upload = multer({
    storage: storage,
    limits: {
        // fieldSize: 100000000
        fileSize: 15 * 1024 * 1024 // 5MB
    }
})

router.post("/aadharcard", Auth, upload.fields([{ name: 'front', maxCount: 1 }, { name: 'back', maxCount: 1 }]), async (req, res) => {

    const { Name, Email, DOB, Gender, Number, Address, verified } = req.body
    var Adharfront;
    var Adharback;
    try {

        if (typeof req.files.front !== 'undefined') {

            fs.access("public/kycdoc", (error) => {
                if (error) {
                    fs.mkdirSync("public/kycdoc");
                }
            });
            const { buffer, originalname } = req.files.front[0];
            const uniqueSuffix = Date.now() + "-1-" + Math.round(Math.random() * 1e9);

            const ref = `${uniqueSuffix}.webp`;
            //   console.log(buffer);
            await sharp(buffer)
                .webp({ quality: 20 })
                .toFile("public/kycdoc/" + ref);

            Adharfront = "public/kycdoc/" + ref
            // data.front= req.files.front[0].path;
        }


        if (typeof req.files.back !== 'undefined') {

            fs.access("public/kycdoc", (error) => {
                if (error) {
                    fs.mkdirSync("public/kycdoc");
                }
            });
            const { buffer, originalname } = req.files.back[0];
            const uniqueSuffix1 = Date.now() + "-2-" + Math.round(Math.random() * 1e9);

            const ref = `${uniqueSuffix1}.webp`;
            //   console.log(buffer);
            await sharp(buffer)
                .webp({ quality: 20 })
                .toFile("public/kycdoc/" + ref);
            Adharback = "public/kycdoc/" + ref
            // data.back= req.files.back[0].path;
        }

        let data = await AadharCard.findOne({ User: req.user.id })

        if (data && data.verified === "verified") {
            return res.send({ msg: false })
        }

        if (data && data.verified === "unverified") {

            data.Name = Name;
            data.Number = Number;
            data.DOB = DOB;
            data.verified = "pending";
            data.front = Adharfront;
            data.back = Adharback;

            data.save();

            const user = await User.findById(data.User);

            user.holder_name = Name;
            user.Email = Email;
            user.verified = 'pending';
            user.save();

            return res.send(data)

        }

        if (data && data.verified === "pending") {
            return res.send({ msg: false })
        }

        dataNew = new AadharCard({
            Name,
            verified: "pending",
            DOB,
            Gender,
            Number,
            Address,
            front: Adharfront,
            back: Adharback,
            User: req.user.id,

        })
        dataNew.save();

        const userNew = await User.findById(dataNew.User);

        userNew.holder_name = Name;
        userNew.Email = Email;
        userNew.verified = 'pending';
        userNew.save();

        return res.send(dataNew)
    }
    catch (e) {
        res.send(e)
        // console.log(e);
    }
})


router.get("/aadharcard/:id", Auth, async (req, res) => {
    await AadharCard.findById({ User: req.params.id }).then((ress) => {
        res.status(200).send(ress)
        // console.log(ress);
    }).catch((e) => {
        res.status(400).send(e)
    })
})


router.get("/aadharcard/all/all/all", Auth, async (req, res) => {
    const PAGE_SIZE = req.query._limit;
    let page = (req.query.page == 0) ? 0 : parseInt(req.query.page - 1);
    try {
        const total = await AadharCard.countDocuments({ verified: "unverified", verified: "pending" });
        const admin = await AadharCard.find({ verified: "unverified", verified: "pending" }).populate("User").sort({ createdAt: -1 }).limit(PAGE_SIZE).skip(PAGE_SIZE * page);
        res.status(200).send({ totalPages: Math.ceil(total / PAGE_SIZE), admin })
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get("/aadharcard/all/all/all/all", Auth, async (req, res) => {
    const searchq = req.query._q;
    // let searchq, searchtype, searchbystatus;
    const searchtype = req.query._stype;
    const PAGE_SIZE = req.query._limit;
    const searchbystatus = req.query._status; let page = (req.query.page == 0) ? 0 : parseInt(req.query.page - 1);
    try {

        let query = {}
        query = await handleQuery(req, {})
        query.verified = { $in: ['verified', 'reject', 'pending', 'unverified'] }
        if (searchq && searchtype)
            query[searchtype] = new RegExp(searchq, 'i')

        if (searchbystatus)
            query.verified = searchbystatus

        const total = await AadharCard.countDocuments(query);
        const admin = await AadharCard.find(query).populate("User").sort({ createdAt: -1 }).limit(PAGE_SIZE).skip(PAGE_SIZE * page);
        
        res.status(200).send({ totalPages: Math.ceil(total / PAGE_SIZE), admin })
    } catch (e) {
        console.log("e.mess", e.message)
        res.status(400).send(e)
    }

})

router.get("/admin/user/kyc/:id", Auth, async (req, res) => {
    await AadharCard.find({ User: req.params.id }).populate("User").sort({ createdAt: -1 }).then((ress) => {
        res.status(200).send(ress)
    }).catch((e) => {
        res.status(400).send(e)
    })
})

router.get("/aadharcard/all/all/complete", Auth, async (req, res) => {
    const PAGE_SIZE = req.query._limit;
    let page = (req.query.page == 0) ? 0 : parseInt(req.query.page - 1);
    try {
        const total = await AadharCard.countDocuments({ verified: "verified" });
        const admin = await AadharCard.find({ verified: "verified" }).populate("User").sort({ createdAt: -1 }).limit(PAGE_SIZE).skip(PAGE_SIZE * page);
        res.status(200).send({ totalPages: Math.ceil(total / PAGE_SIZE), admin })
    } catch (e) {
        res.status(400).send(e)
    }

})

router.get("/aadharcard/all/all/reject", Auth, async (req, res) => {
    const PAGE_SIZE = req.query._limit;
    let page = (req.query.page == 0) ? 0 : parseInt(req.query.page - 1);
    try {
        const total = await AadharCard.countDocuments({ verified: "reject" });
        const admin = await AadharCard.find({ verified: "reject" }).populate("User").sort({ createdAt: -1 }).limit(PAGE_SIZE).skip(PAGE_SIZE * page);
        res.status(200).send({ totalPages: Math.ceil(total / PAGE_SIZE), admin })
    } catch (e) {
        res.status(400).send(e)
    }
})


router.patch("/aadharcard/:id", Auth, async (req, res) => {
    try {

        const data = await AadharCard.findByIdAndUpdate(req.params.id, req.body, { new: true })


        const user = await User.findById(data.User);

        user.verified = req.body.verified == "verified" ? 'verified' : 'unverified';
        user.save();
        res.send("ok")
    } catch (e) {
        res.status(400).send(e)
    }
})



// router.delete("/aadharcard/:id", Auth, async (req, res) => {
//     await AadharCard.findByIdAndDelete(req.params.id).then((ress) => {
//         res.status(200).send("ok")
//         // console.log(ress);
//     }).catch((e) => {
//         res.status(400).send(e)
//     })
// })

router.delete("/aadharcard/:id", Auth, async (req, res) => {
    let data = await AadharCard.findById(req.params.id)
    // await AadharCard.findByIdAndDelete(req.params.id)
    const dir = data.front;
    const dir1 = data.back;

    // delete directory recursively
    try {
        if (dir && dir1 == null || undefined) {
            data.delete();
        } else {
            data.delete();
            fs.rmSync(dir, { recursive: true });
            fs.rmSync(dir1, { recursive: true });
        }
        console.log(`${dir, dir1} data is deleted!`);
    } catch (err) {
        console.error(`Error while deleting ${dir, dir1}.`);
    }

})


module.exports = router

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

