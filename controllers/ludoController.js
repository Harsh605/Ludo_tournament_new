const {join} = require('path')
const views = join(__dirname, '../views');

let {rooms,NumberOfMembers} = require('../Model/model')

exports.root = (_req,res)=>{
    res.redirect(301,'/');
}

exports.room = (req, res) => {
    console.log(rooms,NumberOfMembers);
    try {
        const roomCode = req.params.ROOMCODE;
        
        if (
            Object.keys(rooms).includes(roomCode) &&
            Object.keys(rooms[roomCode]).length < 2
        ) {
            res.sendFile('ludo.html', { root: views });
        } else {
            res.status(404).sendFile('endludo.html', { root: views });
        }
    } catch (e) {
        console.log(e);
        res.status(500).send('Internal Server Error');
    }
}


exports.spectateRoom = (req, res) => {
    console.log(rooms);
    try {
        const roomCode = req.params.ROOMCODE;
        
        if (Object.keys(rooms).includes(roomCode)) {
            res.sendFile('spectateLudo.html', { root: views });
        } else {
            res.status(404).sendFile('endludo.html', { root: views });
        }
    } catch (e) {
        console.log(e);
        res.status(500).send('Internal Server Error');
    }
}


// exports.room = (req,res)=>{
//     console.log(rooms)
//     try{

        
//     if(
//         Object.keys(rooms).includes(req.params.ROOMCODE)  &&
//         Object.keys(rooms[req.params.ROOMCODE]).length < 2 &&
//             (
//             !(NumberOfMembers[req.params.ROOMCODE].constant) ||
//             Object.keys(rooms[req.params.ROOMCODE]).length < NumberOfMembers[req.params.ROOMCODE].members
//             )
//         ){
//             res.sendFile('ludo.html', { root: views });
//         } else{
//             res.statusCode = 404;
//             res.sendFile('endludo.html', { root: views });
//             // res.end('404!:(\nThis is either not a valid Room Code or The room is filled up, Go to home and create a room!');
//         }

//     }catch(e){
//         console.log(e)
//     }
// }
