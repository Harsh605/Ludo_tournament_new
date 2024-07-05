const router = require("express").Router()
const Auth = require("../Middleware/Auth")
const Transaction = require("../Model/transaction")
const User = require("../Model/User")
const Temp = require('../Model/temp/temp')
const Game = require("../Model/Games");
const multer = require('multer');
const upload = multer();
const axios = require("axios").default;


//bonusbyadmin
router.get("/txn/bonusreports/all", Auth, async (req, res) => {
   
    const PAGE_SIZE = req.query._limit;
    let page =(req.query.page==0)? 0 : parseInt(req.query.page-1);
    let FROM_DATE=req.query.FROM_DATE;
    let TO_DATE=req.query.TO_DATE;
    try {
        
        const total = await Transaction.countDocuments({$and: [{ Req_type: "bonus" },{createdAt: {"$gte": new Date(FROM_DATE), "$lt": new Date(TO_DATE)}}]});
        const datefind=await Transaction.find({$and: [{ Req_type: "bonus" },{createdAt: {"$gte": new Date(FROM_DATE), "$lt": new Date(TO_DATE)}}]}).populate("User_id").populate("action_by").sort({ createdAt: -1 }).limit(PAGE_SIZE).skip(PAGE_SIZE * page);
        //const admin = await Transaction.find({$and: [{ Req_type: "bonus" }]} && query).populate("User_id").sort({ createdAt: -1 }).limit(PAGE_SIZE).skip(PAGE_SIZE * page)
        // console.log(datefind);
        res.status(200).send({totalPages: Math.ceil(total / PAGE_SIZE), datefind})

    } catch (e) {
        res.status(400).send(e)
    }
})


//penaltyByAdmin(AddBYTEAM)
router.get("/txn/penaltyreports/all", Auth, async (req, res) => {
    const PAGE_SIZE = req.query._limit;
    let FROM_DATE=req.query.FROM_DATE;
    let TO_DATE=req.query.TO_DATE;
    let page =(req.query.page==0)? 0 : parseInt(req.query.page-1);
    try {
        const total = await Transaction.countDocuments({$and: [{ Req_type: "penalty" },{createdAt: {"$gte": new Date(FROM_DATE), "$lt": new Date(TO_DATE)}}]});
        
        const datefind=await Transaction.find({$and: [{ Req_type: "penalty" },{createdAt: {"$gte": new Date(FROM_DATE), "$lt": new Date(TO_DATE)}}]}).populate("User_id").populate("action_by").sort({ createdAt: -1 }).limit(PAGE_SIZE).skip(PAGE_SIZE * page);
        res.status(200).send({totalPages: Math.ceil(total / PAGE_SIZE), datefind})

    } catch (e) {
        res.status(400).send(e)
    }
})

router.get("/txn/depositreports/all", Auth, async (req, res) => {
    const PAGE_SIZE = req.query._limit;
    let FROM_DATE=req.query.FROM_DATE;
    let TO_DATE=req.query.TO_DATE;

    let page =(req.query.page==0)? 0 : parseInt(req.query.page-1);
    try {
        const total = await Transaction.countDocuments({$and: [{ Req_type: "deposit" },{createdAt: {"$gte": new Date(FROM_DATE), "$lt": new Date(TO_DATE)}}]});
        const datefind=await Transaction.find({$and: [{ Req_type: "deposit" },{createdAt: {"$gte": new Date(FROM_DATE), "$lt": new Date(TO_DATE)}}]}).populate("User_id").populate("action_by").sort({ createdAt: -1 }).limit(PAGE_SIZE).skip(PAGE_SIZE * page);
        res.status(200).send({totalPages: Math.ceil(total / PAGE_SIZE), datefind})

    } catch (e) {
        res.status(400).send(e)
    }
})

router.get("/txn/withdrawalreports/all", Auth, async (req, res) => {
    let FROM_DATE=req.query.FROM_DATE;
    let TO_DATE=req.query.TO_DATE;

    const PAGE_SIZE = req.query._limit;
    let page =(req.query.page==0)? 0 : parseInt(req.query.page-1);
    try {
        const total = await Transaction.countDocuments({$and: [{ Req_type: "withdraw" },{createdAt: {"$gte": new Date(FROM_DATE), "$lt": new Date(TO_DATE)}}]});
        const datefind=await Transaction.find({$and: [{ Req_type: "withdraw" },{createdAt: {"$gte": new Date(FROM_DATE), "$lt": new Date(TO_DATE)}}]}).populate("User_id").populate("action_by").sort({ createdAt: -1 }).limit(PAGE_SIZE).skip(PAGE_SIZE * page);
        
        //res.status(200).send(data)
        
        res.status(200).send({totalPages: Math.ceil(total / PAGE_SIZE),datefind})
    } catch (e) {
        res.status(400).send(e)
    }
})

module.exports =router;