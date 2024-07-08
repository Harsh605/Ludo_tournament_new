const {join} = require('path')
const views = join(__dirname, '../views');

let {rooms,NumberOfMembers} = require('../Model/model')

exports.root = (_req,res)=>{
    res.redirect(301,'/');
}

exports.room = (req,res)=>{

    let ROOMCODE = req.query.room_code
    if(
    Object.keys(rooms).includes(ROOMCODE) &&
    Object.keys(req.query).length===0  &&
    Object.keys(rooms[ROOMCODE]).length < 2 &&
        (
        !(NumberOfMembers[ROOMCODE].constant) ||
        Object.keys(rooms[ROOMCODE]).length < NumberOfMembers[ROOMCODE].members
        )
    ){
        res.sendFile('ludo.html', { root: views });
    } else{
        res.statusCode = 404;
        res.end('404!:(\nThis is either not a valid Room Code or The room is filled up, Go to home and create a room!');
    }
}
