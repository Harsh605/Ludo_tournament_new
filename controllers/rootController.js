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
        res.send(200, `http://84.247.133.7:5010/ludo/${p0th}`)
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