const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const axios = require('axios');
const { WebSocket, WebSocketServer } = require('ws')
const app = express();
const cors = require('cors');
const httpServer = createServer(app);
const mongoose = require("mongoose");
const Game = require("./model/Game");
const User = require("./model/User");
const SiteSettings = require("./model/settings");

httpServer.listen(7001, (req, res) => {
    console.log("server 7001");
});

mongoose.connect("mongodb+srv://thinkinternet2020:FlrUonevplMlfTXx@cluster0.bgydh5k.mongodb.net/khelludokhel?retryWrites=true&w=majority", {
//mongoose.connect("mongodb://0.0.0.0:27017/jpludo", {

}, (err) => {
    if (!err) {
        console.log(`you are connected ludoplay`);
    } else {
        console.log(`you are not connected ludoplay`);
    }
})

var corsOptions = {
    origin: '*',
    //optionsSuccessStatus: 200 // For legacy browser support
}


app.use(cors(corsOptions));


const wss = new WebSocket.Server({noServer: true});
const broadcastEvent = (event,data)=>{
    wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            event:event,
            data:data
          }));
        }
    });
}



async function deduct_wallet(user1_id, user2_id, gameAmount,Game) {
    const user1 = await User.findById(user1_id);
    const user2 = await User.findById(user2_id)
    user2.Wallet_balance -= gameAmount;
    user1.Wallet_balance -= gameAmount;
    user2.hold_balance+=gameAmount;
    user1.hold_balance+=gameAmount;   

    if (user1.withdrawAmount>=gameAmount) {
         user1.withdrawAmount -= gameAmount;
         Game.acceptorWithdrawDeducted=gameAmount;
    }
    else{
        Game.acceptorWithdrawDeducted=user1.withdrawAmount;
        user1.withdrawAmount = 0;
    }
    if (user2.withdrawAmount>=gameAmount) {
         user2.withdrawAmount -= gameAmount;
         Game.creatorWithdrawDeducted=gameAmount;
    }
    else{
        Game.creatorWithdrawDeducted=user2.withdrawAmount;
        user2.withdrawAmount = 0;
    }
   
    await user2.save();
    await user1.save();
    await Game.save();
    return { Winner_closingbalance: user1.Wallet_balance, Loser_closingbalance: user2.Wallet_balance };
}

async function prevCreated(creator, acceptor) {
    const games = await Game.find({ $and: [{ $and: [{ Status: "new" }, { Created_by: creator }] },] });
    if (games.length) {
        games.forEach(async ele => { 
            //await ele.delete()
            ele.Status = "drop"
            await ele.save()
        })
    }
    const games1 = await Game.find({ $and: [{ $and: [{ Status: "new" }, { Created_by: acceptor }] },] });
    if (games1.length) {
        games1.forEach(async ele => { 
            //await ele.delete()
            ele.Status = "drop"
            await ele.save()
        })
    }
}
async function prevRequested(creator, acceptor) {
    // for creator 
    const creatorGames = await Game.find({ $and: [{ $and: [{ Status: "requested" }, { Accepetd_By: creator }] },] });
    if (creatorGames.length) {
        creatorGames.forEach(async ele => {
            ele.Status = "new";
            ele.Accepetd_By = null;
            ele.Acceptor_by_Creator_at = null;
            await ele.save();
        })

    }
    const creatorGames1 = await Game.find({ $and: [{ $and: [{ Status: "requested" }, { Created_by: creator }] },] });
    if (creatorGames1.length) {
        creatorGames1.forEach(async ele => { 
            //console.log('game delete from socket line 118');
            ele.Status = "drop"
            await ele.save()
            //await ele.delete() 
        })
    }
    // for acceptor 
    const acceptorGames = await Game.find({ $and: [{ $and: [{ Status: "requested" }, { Accepetd_By: acceptor }] },] });
    if (acceptorGames.length) {
        acceptorGames.forEach(async ele => {
            ele.Accepetd_By = null;
            ele.Status = "new";
            ele.Acceptor_by_Creator_at = null;
            await ele.save();
        })

    }
    const acceptorGames1 = await Game.find({ $and: [{ $and: [{ Status: "requested" }, { Created_by: acceptor }] },] });
    if (acceptorGames1.length) {
        acceptorGames1.forEach(async ele => { 
            //await ele.delete()
            ele.Status = "drop"
            await ele.save()
         })
    }
}


wss.on('connection', function (ws) { 
    ws.on('message',async function (message) { 
        const { event, data }= JSON.parse(message);
        //console.log('even is =>',event,'data and 🤔',data)
        switch (event) {
    case 'gameCreated': {
        const status = await Game.find(
            { $or: [{ Status: "new" }, { Status: "requested" }, { Status: "running" }] }
        ).populate("Created_by" , "Name Phone avatar _id" ).populate("Accepetd_By" , "Name Phone avatar _id" ).populate("Winner" , "Name Phone avatar _id" )
        broadcastEvent('recieveGame', status);
        break;
    }


    case 'gameRejected': {
        const status = await Game.find(
            { $or: [{ Status: "new" }, { Status: "requested" }, { Status: "running" }] }
        ).populate("Created_by" , "Name Phone avatar _id" ).populate("Accepetd_By" , "Name Phone avatar _id" ).populate("Winner" , "Name Phone avatar _id" )
        broadcastEvent('updateReject', status);
        break;
    }
    case 'challenge_running': {
        const status = await Game.find(
            { $or: [{ Status: "new" }, { Status: "requested" }, { Status: "running" }] }
        ).populate("Created_by" , "Name Phone avatar _id" ).populate("Accepetd_By" , "Name Phone avatar _id" ).populate("Winner" , "Name Phone avatar _id" )
        broadcastEvent('updateRunning', status);
            break;
    }

    case "deleteGame": {
        // console.log(data);
        await Game.findByIdAndDelete(data)
        const status = await Game.find(
            { $or: [{ Status: "new" }, { Status: "requested" }, { Status: "running" }] }
        ).populate("Created_by" , "Name Phone avatar _id" ).populate("Accepetd_By" , "Name Phone avatar _id" ).populate("Winner" , "Name Phone avatar _id" )
        broadcastEvent("updateDelete", status)
        // }
        break;
    }


    case "resultAPI": {
        const game = await Game.find({ $or: [{ Status: "running" }, { Status: "pending" }, { Status: "conflict" }] }).populate("Created_by").populate("Created_by" , "Name Phone avatar _id" ).populate("Accepetd_By" , "Name Phone avatar _id" ).populate("Winner" , "Name Phone avatar _id" );
        broadcastEvent("resultUpdateReq", game);
        break;
    }

    case "game_seen": {
        const openBattle = await Game.find(
            { $or: [{ Status: "new" }, { Status: "requested" }, { Status: "running" }] }
        ).populate("Created_by").populate("Accepetd_By").populate("Winner")
        const runningBattle = await Game.find({ $or: [{ Status: "running" }, { Status: "pending" }, { Status: "conflict" }] }).populate("Created_by" , "Name Phone avatar _id" ).populate("Accepetd_By" , "Name Phone avatar _id" ).populate("Winner" , "Name Phone avatar _id" );
        const data = { openBattle: openBattle, runningBattle: runningBattle };
        broadcastEvent("acceptor_seen", data)
        break;
    }


    case "acceptGame": {
        const status = await Game.find(
            { $or: [{ Status: "new" }, { Status: "requested" }, { Status: "running" }] }
        ).populate("Created_by" , "Name Phone avatar _id" ).populate("Accepetd_By" , "Name Phone avatar _id" ).populate("Winner" , "Name Phone avatar _id" )
        broadcastEvent("challengeAccepted", status)
        break;
    }
    case 'challengeOngoing': {
        const openBattle = await Game.find(
            { $or: [{ Status: "new" }, { Status: "requested" }, { Status: "running" }] }
        ).populate("Created_by" , "Name Phone avatar _id" ).populate("Accepetd_By" , "Name Phone avatar _id" ).populate("Winner" , "Name Phone avatar _id" )
        const runningBattle = await Game.find({ $or: [{ Status: "running" }, { Status: "pending" }, { Status: "conflict" }] }).populate("Created_by" , "Name Phone avatar _id" ).populate("Accepetd_By" , "Name Phone avatar _id" ).populate("Winner" , "Name Phone avatar _id" );
        const data = { openBattle: openBattle, runningBattle: runningBattle };
        broadcastEvent("ongoingChallenge", data)
        break;
    }

    case 'runningGame':{
        broadcastEvent("running", data)
        break;
    }

    case 'updateHeader': {
        broadcastEvent("HeaderUpdate");
        break;
    }
    
    case 'roomCode': {
          const setting = await SiteSettings.findOne()
        const localGame = await Game.findById(data.game_id);
        // && localGame.Accepetd_By!=null
        if (localGame.Status != "completed" && localGame.Status != "cancelled" && localGame.Status == "requested" ) {
                const updateResult = await Game.findByIdAndUpdate(data.game_id,{Status:'running'}).where("Status").equals('requested').where("Accepetd_By").ne(null);
               
                if(updateResult!=null)
                {
                const { Winner_closingbalance, Loser_closingbalance } = await deduct_wallet(localGame.Accepetd_By, localGame.Created_by, localGame.Game_Ammount, localGame)
                localGame.Winner_closingbalance = Winner_closingbalance; localGame.Loser_closingbalance = Loser_closingbalance;
                localGame.save();
                await prevRequested(localGame.Created_by, localGame.Accepetd_By);
                await prevCreated(localGame.Created_by, localGame.Accepetd_By);
                  
                    var url = 'https://api.rkludo.in/api/roomcode/classic1';
       
            if(setting && setting.roomcodeAuto == false){
            if(setting.roomcodeUrl){
                url = setting.roomcodeUrl
            }
           
            await axios.get(url)
                    .then(res => {
                    
                        if (res.status == 200) {
                            console.log(res.data,'roomcode')
                            //{"status":"ROOM_CODE","message":"New Room Code","responsecode":"200","data":"02170549"}
                            localGame.Room_code = (res.data.roomcode)?res.data.roomcode:res.data.data;
                            localGame.save();
                        }    
                    })
                    .catch(err => {
                        localGame.Room_code = 0;
                        localGame.save();
                        console.log('room err');
                    })
            } else{
                       localGame.Room_code = 0;
                    localGame.save();
                }
                    
                const status = await Game.find({ $or: [{ Status: "new" }, { Status: "requested" }, { Status: "running" }] }).populate("Created_by" , "Name Phone avatar _id" ).populate("Accepetd_By" , "Name Phone avatar _id" ).populate("Winner" , "Name Phone avatar _id" );
                broadcastEvent("startAcepptor", status);
                }
        }
        else {
            const status = await Game.find({ $or: [{ Status: "new" }, { Status: "requested" }, { Status: "running" }] }).populate("Created_by" , "Name Phone avatar _id" ).populate("Accepetd_By" , "Name Phone avatar _id" ).populate("Winner" , "Name Phone avatar _id" );
            broadcastEvent("startAcepptor", status);
        }
        break;

    }

    case 'popularroomCode': {
         const setting = await SiteSettings.findOne()
        const localGame = await Game.findById(data.game_id);
        if (localGame.Status != "completed" && localGame.Status != "cancelled" && localGame.Status == "requested") {
            localGame.Status = 'running';
            const { Winner_closingbalance, Loser_closingbalance } = await deduct_wallet(localGame.Accepetd_By, localGame.Created_by, localGame.Game_Ammount,localGame)
            localGame.Winner_closingbalance = Winner_closingbalance; localGame.Loser_closingbalance = Loser_closingbalance;
            await localGame.save();
            await prevRequested(localGame.Created_by, localGame.Accepetd_By);
            await prevCreated(localGame.Created_by, localGame.Accepetd_By);
            const status = await Game.find({ $or: [{ Status: "new" }, { Status: "requested" }, { Status: "running" }] }).populate("Created_by" , "Name Phone avatar _id" ).populate("Accepetd_By" , "Name Phone avatar _id" ).populate("Winner" , "Name Phone avatar _id" );
            broadcastEvent("startAcepptor", status);
            var url = 'https://pyroom.rkgames.online/getmycode';
            if(setting && setting.roomcodeAuto == false){
            if(setting.roomcodeUrlPopular){
                url = setting.roomcodeUrlPopular
            }
         
            await axios.get(url)
                .then(res => {
                    if (res.status == 200) {
                        localGame.Room_code = res.data.roomcode;
                        localGame.save();
                    }
                })
                .catch(err => {
                    localGame.Room_code = 0;
                    localGame.save();
                    console.log(err);
                })
               } else{
                       localGame.Room_code = 0;
                    localGame.save();
                }
        }
        else {
            const status = await Game.find({ $or: [{ Status: "new" }, { Status: "requested" }, { Status: "running" }] }).populate("Created_by" , "Name Phone avatar _id" ).populate("Accepetd_By" , "Name Phone avatar _id" ).populate("Winner" , "Name Phone avatar _id" );
            broadcastEvent("startAcepptor", status);
        }
        break;

    }
    case 'pong':{
        ws.isAlive = true;
        break;
    }
    default:
                break;
    }
    })
})



const interval = setInterval(function ping() {
    wss.clients.forEach(function each(ws) {
        //console.log('is terminate 🤔',ws.isAlive === false,'adn sockt state 🗑️',ws.readyState);
      if (ws.isAlive === false) return ws.terminate();
      ws.isAlive = false;
      ws.send(JSON.stringify({
        event:'ping',
        data: 3
      }));
    });
  }, 30000);
  
  wss.on('close', function close() {
    clearInterval(interval);
  });

httpServer.on('upgrade', function upgrade(request, socket, head) {
    // This function is not defined on purpose. Implement it with your own logic.
    // authenticate(request, function next(err, client) {
    //   if (err || !client) {
    //     socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
    //     socket.destroy();
    //     return;
    //   }
  
      wss.handleUpgrade(request, socket, head, function done(ws) {
        wss.emit('connection', ws, request);
      });
    // });
});
