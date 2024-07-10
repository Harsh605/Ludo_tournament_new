const {join} = require('path')
let {rooms,NumberOfMembers,win} = require('../Model/model')

const views = join(__dirname, '../views');

exports.get = (req,res)=>{
    res.sendFile('index.html', { root: views });
}

exports.post = (req,res)=>{
    if(req.body.action_to_do === 'create'){
        let p0th = randomPath()
        rooms[p0th] = {};
        win[p0th] = {};
        NumberOfMembers[p0th] = {constant:false,members:2};
         //res.redirect(301, 'ludo/' + p0th);
        //  let token = req.body.token;
        //  let game_id = req.body.game_id;
         
         // Set cookies
        //  res.cookie('token', token, { maxAge: 900000, httpOnly: true, sameSite: 'strict' });
        //  res.cookie('game_id', game_id, { maxAge: 900000, httpOnly: true, sameSite: 'strict' });
        //  res.cookie('room_path', p0th, { maxAge: 900000, httpOnly: true, sameSite: 'strict' });
 
        // res.status(200).send(`http://localhost:5010/ludo/${p0th}?token=${req.body.token}&game_id=${req.body.game_id}`);
         //res.status(200).send(`http://localhost:5010/ludo/${p0th}`);
         res.status(200).send(`http://84.247.133.7:5010/ludo/${p0th}`);
        //res.redirect(301, 'ludo/' + p0th + `?token=${req.body.token}&game_id=${req.body.game_id}`);
    } else if(req.body.action_to_do === 'join'){
            if(Object.keys(rooms).includes(req.body.roomcode)){
                res.redirect(301, 'ludo/' + req.body.roomcode);
            } else{
                res.statusCode = 404;
                res.end('404!');
            }
        } else{
            res.statusCode = 404;
            res.end('404!');
            res.redirect(301, '/');
        }
}

//to generate unique rooms
function randomPath(){
    let randomPath = Math.random().toString(36).substr(2, 6);
    if(!Object.keys(rooms).includes(randomPath)){
        return randomPath;
    } else{ randomPath(); }
};
