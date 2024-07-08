const {join} = require('path')
const views = join(__dirname, '../views');

let {rooms,NumberOfMembers} = require('../Model/model')

exports.root = (_req,res)=>{
    res.redirect(301,'/');
}

exports.room = (req, res) => {
    const { token, game_id, ...otherParams } = req.query;
    
    if (
        Object.keys(rooms).includes(req.params.ROOMCODE) &&
        Object.keys(otherParams).length === 0 &&
        Object.keys(rooms[req.params.ROOMCODE]).length < 2 &&
        (
            !(NumberOfMembers[req.params.ROOMCODE].constant) ||
            Object.keys(rooms[req.params.ROOMCODE]).length < NumberOfMembers[req.params.ROOMCODE].members
        )
    ) {
        res.sendFile('ludo.html', { root: views });
    } else {
        res.status(404).send('404!:(\nThis is either not a valid Room Code or The room is filled up, Go to home and create a room!');
    }
}
