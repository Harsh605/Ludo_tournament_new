// let socket = io(window.location.href.substring(0,window.location.href.length-7));

const urlParams = new URLSearchParams(window.location.search);

const token = urlParams.get("token");
const gameId = urlParams.get("game_id");

const url = window.location.href;
const ludoIndex = url.indexOf("/ludo");
const path = url.substring(ludoIndex, ludoIndex + 5); // "/ludo"

let socket = io(path); // This is your existing socket connection

let sockets; // This will be our WebSocket connection
let JoinTimeOut;

function initializeSocket() {
  sockets = new WebSocket("wss://socket.ludowinners.in");

  function openFunc() {
    sockets.onopen = () => {
      console.log("WebSocket is connected 👍");
      // Set ping timeout
      sockets.pingTimeout = setTimeout(() => {
        sockets.close();
      }, 31000);
    };
  }

  function listenFunc() {
    sockets.onmessage = (event) => {
      try {
        const { event: eventName, data } = JSON.parse(event.data);

        if (eventName === "ping") {
          sockets.send(JSON.stringify({ event: "pong", data: 2 }));
          clearTimeout(sockets.pingTimeout);
          sockets.pingTimeout = setTimeout(() => {
            sockets.close();
          }, 31000);
        }

        console.log(`Received event: ${eventName}`, data);
      } catch (error) {
        console.error("Error processing message:", error);
      }
    };
  }

  function closeFunc() {
    sockets.onclose = () => {
      console.log("WebSocket disconnected wow 😡");
      clearTimeout(sockets.pingTimeout);
      // Attempt to reconnect
      setTimeout(initializeSocket, 1000);
    };
  }

  openFunc();
  listenFunc();
  closeFunc();
}

// Initialize the WebSocket connection
initializeSocket();

// Clean up function (call this when you want to disconnect)
function cleanup() {
  if (sockets) {
    clearTimeout(sockets.pingTimeout);
    sockets.close();
  }
}

// Function to send messages through the WebSocket
function sendWebSocketMessage(eventName, data = null) {
  if (sockets && sockets.readyState === WebSocket.OPEN) {
    const message = JSON.stringify({ event: eventName, data });
    sockets.send(message);
    console.log(`Sent WebSocket message: ${message}`);
  } else {
    console.error(
      `WebSocket is not open. Unable to send message: ${eventName}`
    );
    console.log(
      `WebSocket readyState: ${sockets ? sockets.readyState : "undefined"}`
    );
  }
}

// const room_code = window.location.href.substring(window.location.href.length-6);

const roomCodeStartIndex = url.indexOf("/ludo/") + "/ludo/".length;
const roomCodeEndIndex = url.indexOf("?", roomCodeStartIndex); // find the first '?' after the room code
const room_code =
  roomCodeEndIndex !== -1
    ? url.substring(roomCodeStartIndex, roomCodeEndIndex)
    : url.substring(roomCodeStartIndex);

const USERNAMES = ["Blue", "Green", "Yellow", "Red"];
const PIECES = [];
const colors = ["blue", "green", "yellow", "red"];
let MYROOM = [];
let myid = -1;
let chance = Number(-1);
var PLAYERS = {};



var canvas = document.getElementById("theCanvas");
var ctx = canvas.getContext("2d");

// At the beginning of the file, add these global variables
let CANVAS_SIZE = 750; // Original canvas size
let scaleX, scaleY;

var styleWidth = parseInt(window.getComputedStyle(canvas).width);
var styleHeight = parseInt(window.getComputedStyle(canvas).height);

canvas.width = styleWidth;
canvas.height = styleHeight;

let diceTimeout;
let avatarTimeout;
let remaningChance = 5;


// Scale factor
scaleX = styleWidth / CANVAS_SIZE;
scaleY = styleHeight / CANVAS_SIZE;

// Function to scale positions
function scalePosition(position) {
  return {
    x: position.x * scaleX,
    y: position.y * scaleY,
  };
}

let allPiecesePos = {
  0: [
    scalePosition({ x: 80, y: 65 }),
    scalePosition({ x: 172, y: 65 }),
    scalePosition({ x: 172, y: 155 }),
    scalePosition({ x: 82, y: 155 }),
  ],
  1: [
    scalePosition({ x: 525, y: 60 }),
    scalePosition({ x: 620, y: 60 }),
    scalePosition({ x: 530, y: 150 }),
    scalePosition({ x: 620, y: 150 }),
  ],
  2: [
    scalePosition({ x: 533, y: 515 }),
    scalePosition({ x: 625, y: 515 }),
    scalePosition({ x: 624, y: 605 }),
    scalePosition({ x: 535, y: 605 }),
  ],
  3: [
    scalePosition({ x: 82, y: 515 }),
    scalePosition({ x: 172, y: 515 }),
    scalePosition({ x: 173, y: 605 }),
    scalePosition({ x: 80, y: 605 }),
  ],
};

let homeTilePos = {
  0: {
    0: scalePosition({ x: 50, y: 290 }),
    1: scalePosition({ x: 300, y: 100 }),
  },
  1: {
    0: scalePosition({ x: 400, y: 28 }),
    1: scalePosition({ x: 600, y: 300 }),
  },
  2: {
    0: scalePosition({ x: 650, y: 390 }),
    1: scalePosition({ x: 400, y: 600 }),
  },
  3: {
    0: scalePosition({ x: 300, y: 630 }),
    1: scalePosition({ x: 100, y: 400 }),
  },
};

// Define safe squares (stamps) for each player
const safeSquares = {
  0: [0, 8, 13, 21, 26, 34, 39, 47],  // Adjust these indices as needed
  1: [0, 8, 13, 21, 26, 34, 39, 47],
  2: [0, 8, 13, 21, 26, 34, 39, 47],
  3: [0, 8, 13, 21, 26, 34, 39, 47]
};

class Player {
  constructor(id) {
    this.id = String(id);
    this.myPieces = new Object();
    for (let i = 0; i < 4; i++) {
      this.myPieces[i] = new Piece(String(i), String(id));
    }
    this.won = 0;
  }
  draw() {
    for (let i = 0; i < 4; i++) {
      this.myPieces[i].draw();
    }
  }

  didIwin() {
    if (this.won == 4) {
      return 1;
    } else {
      return 0;
    }
  }
  incrementWon() {
    this.won += 1;
    console.log(`Player ${this.id} won count: ${this.won}`);
  }

}

class Piece {
  constructor(i, id) {
    this.path = [];
    this.color_id = String(id);
    this.Pid = String(i);
    this.pos = -1;
    this.x = parseInt(allPiecesePos[this.color_id][this.Pid].x);
    this.y = parseInt(allPiecesePos[this.color_id][this.Pid].y);
    this.image = PIECES[this.color_id];
    this.initializePath(id);
    this.isAnimating = false;
  }

  bounceAnimation() {
    if (this.isAnimating) return;
    this.isAnimating = true;
    
    const originalY = this.y;
    const bounceHeight = 20 * scaleY;
    const animationDuration = 500; // ms
    const startTime = Date.now();

    const animate = () => {
      const elapsedTime = Date.now() - startTime;
      const progress = elapsedTime / animationDuration;

      if (progress < 1) {
        // Easing function for smooth animation
        const easeProgress = Math.sin(progress * Math.PI);
        this.y = originalY - bounceHeight * easeProgress;
        
        this.clearPreviousPosition();
        this.draw();
        
        requestAnimationFrame(animate);
      } else {
        this.y = originalY;
        this.clearPreviousPosition();
        this.draw();
        this.isAnimating = false;
      }
    };

    animate();
  }

  initializePath(id) {
    const pathConfigs = {
      "0": [
        { method: this.oneStepToRight, count: 4 },
        { method: this.oneStepTowards45, count: 1 },
        { method: this.oneStepToTop, count: 5 },
        { method: this.oneStepToRight, count: 2 },
        { method: this.oneStepToBottom, count: 5 },
        { method: this.oneStepTowards315, count: 1 },
        { method: this.oneStepToRight, count: 5 },
        { method: this.oneStepToBottom, count: 2 },
        { method: this.oneStepToLeft, count: 5 },
        { method: this.oneStepTowards225, count: 1 },
        { method: this.oneStepToBottom, count: 5 },
        { method: this.oneStepToLeft, count: 2 },
        { method: this.oneStepToTop, count: 5 },
        { method: this.oneStepTowards135, count: 1 },
        { method: this.oneStepToLeft, count: 5 },
        { method: this.oneStepToTop, count: 1 },
        { method: this.oneStepToRight, count: 6 }
      ],
      "1": [
        { method: this.oneStepToBottom, count: 4 },
        { method: this.oneStepTowards315, count: 1 },
        { method: this.oneStepToRight, count: 5 },
        { method: this.oneStepToBottom, count: 2 },
        { method: this.oneStepToLeft, count: 5 },
        { method: this.oneStepTowards225, count: 1 },
        { method: this.oneStepToBottom, count: 5 },
        { method: this.oneStepToLeft, count: 2 },
        { method: this.oneStepToTop, count: 5 },
        { method: this.oneStepTowards135, count: 1 },
        { method: this.oneStepToLeft, count: 5 },
        { method: this.oneStepToTop, count: 2 },
        { method: this.oneStepToRight, count: 5 },
        { method: this.oneStepTowards45, count: 1 },
        { method: this.oneStepToTop, count: 5 },
        { method: this.oneStepToRight, count: 1 },
        { method: this.oneStepToBottom, count: 6 }
      ],
      "2": [
        { method: this.oneStepToLeft, count: 4 },
        { method: this.oneStepTowards225, count: 1 },
        { method: this.oneStepToBottom, count: 5 },
        { method: this.oneStepToLeft, count: 2 },
        { method: this.oneStepToTop, count: 5 },
        { method: this.oneStepTowards135, count: 1 },
        { method: this.oneStepToLeft, count: 5 },
        { method: this.oneStepToTop, count: 2 },
        { method: this.oneStepToRight, count: 5 },
        { method: this.oneStepTowards45, count: 1 },
        { method: this.oneStepToTop, count: 5 },
        { method: this.oneStepToRight, count: 2 },
        { method: this.oneStepToBottom, count: 5 },
        { method: this.oneStepTowards315, count: 1 },
        { method: this.oneStepToRight, count: 5 },
        { method: this.oneStepToBottom, count: 1 },
        { method: this.oneStepToLeft, count: 6 }
      ],
      "3": [
        { method: this.oneStepToTop, count: 4 },
        { method: this.oneStepTowards135, count: 1 },
        { method: this.oneStepToLeft, count: 5 },
        { method: this.oneStepToTop, count: 2 },
        { method: this.oneStepToRight, count: 5 },
        { method: this.oneStepTowards45, count: 1 },
        { method: this.oneStepToTop, count: 5 },
        { method: this.oneStepToRight, count: 2 },
        { method: this.oneStepToBottom, count: 5 },
        { method: this.oneStepTowards315, count: 1 },
        { method: this.oneStepToRight, count: 5 },
        { method: this.oneStepToBottom, count: 2 },
        { method: this.oneStepToLeft, count: 5 },
        { method: this.oneStepTowards225, count: 1 },
        { method: this.oneStepToBottom, count: 5 },
        { method: this.oneStepToLeft, count: 1 },
        { method: this.oneStepToTop, count: 6 }
      ]
    };

    const config = pathConfigs[id];
    if (config) {
      config.forEach(({ method, count }) => {
        for (let i = 0; i < count; i++) {
          this.path.push(method);
        }
      });
    } else {
      console.error(`Invalid id: ${id}`);
    }
  }

  draw() {
    const scaleFactor = 1.3;
    const newWidth = 45 * scaleX * scaleFactor;
    const newHeight = 60 * scaleY * scaleFactor;
    const offsetX = (newWidth - 50 * scaleX) / 2;
    const offsetY = (newHeight - 50 * scaleY) / 2;

    ctx.drawImage(
      this.image,
      this.x - offsetX,
      this.y - offsetY,
      newWidth,
      newHeight
    );
  }

  isOnSafeSquare() {
    return safeSquares[this.color_id].includes(this.pos);
  }

  async moveStepByStep(num) {
    if (this.pos != -1 && this.pos + num <= 56) {
      for (let i = 0; i < num; i++) {
        await this.moveOneStep(this.pos + i);
        this.redrawAllPieces();
      }
      this.pos += num;
      if (this.pos == 56) {
         window.PLAYERS[this.color_id].incrementWon();
        this.giveExtraTurn();
      } else {
        this.checkForKill();
      }
    } else if (num == 6 && this.pos == -1) {
      this.x = homeTilePos[this.color_id][0].x;
      this.y = homeTilePos[this.color_id][0].y;
      this.pos = 0;
      this.redrawAllPieces();  // New line
      this.checkForKill();
    }
    this.redrawAllPieces();  // New line to ensure final state is correct
    allPlayerHandler();
  }

  async moveOneStep(pathIndex) {
    return new Promise(resolve => {
      setTimeout(() => {
        this.clearBoard();  // Clear the entire board
        this.path[pathIndex](this.color_id, this.Pid);
        this.redrawAllPieces();  // Redraw all pieces
        resolve();
        var piceSound = document.getElementById("piceSound");
        piceSound.play();
      }, 200);
    });
  }

  clearBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Redraw the static parts of the board here
    // For example: drawBoard();
  }

  redrawAllPieces() {
    for (let playerId in window.PLAYERS) {
      let player = window.PLAYERS[playerId];
      for (let pieceId in player.myPieces) {
        player.myPieces[pieceId].draw();
      }
    }
  }

  clearPreviousPosition() {
    const scaleFactor = 1.3;
    const clearWidth = 45 * scaleX * scaleFactor;
    const clearHeight = 60 * scaleY * scaleFactor;
    const clearX = this.x - (clearWidth - 50 * scaleX) / 2;
    const clearY = this.y - (clearHeight - 50 * scaleY) / 2;

    ctx.clearRect(clearX, clearY, clearWidth, clearHeight);
  }

  // update(num) {
  //   this.moveStepByStep(num);
  // }

  async update(num) {
    console.log(`Updating piece ${this.id} with move ${num}`);
    await this.moveStepByStep(num);
    console.log(`Piece ${this.id} update complete`);
    return this.pos == 56; // Return true if the piece has reached the end
  }

  checkForKill() {
    if (this.isOnSafeSquare()) return;
    for (let playerId in window.PLAYERS) {
      if (playerId !== this.color_id) {
        let otherPlayer = window.PLAYERS[playerId];
        for (let pieceId in otherPlayer.myPieces) {
          let otherPiece = otherPlayer.myPieces[pieceId];
          if (otherPiece.pos !== -1 && !otherPiece.isOnSafeSquare() &&
              Math.abs(this.x - otherPiece.x) < 5 * scaleX &&
              Math.abs(this.y - otherPiece.y) < 5 * scaleY) {
            otherPiece.kill();
            this.giveExtraTurn(); // Give an extra turn when piece reaches home      
          }
        }
      }
    }
  }

  giveExtraTurn() {
    socket.emit("chance", {
      room: room_code,
      nxt_id: chanceRotation(myid, 0),
    });
    togglePlayerTurn(false); // Player's turn ends after rolling
    styleButton(0);
  }

  oneStepToRight(id, pid) {
    window.PLAYERS[id].myPieces[pid].x += 50 * scaleX;
  }

  oneStepToLeft(id, pid) {
    window.PLAYERS[id].myPieces[pid].x -= 50 * scaleX;
  }

  oneStepToTop(id, pid) {
    window.PLAYERS[id].myPieces[pid].y -= 50 * scaleY;
  }

  oneStepToBottom(id, pid) {
    window.PLAYERS[id].myPieces[pid].y += 50 * scaleY;
  }

  oneStepTowards45(id, pid) {
    window.PLAYERS[id].myPieces[pid].x += 50 * scaleX;
    window.PLAYERS[id].myPieces[pid].y -= 50 * scaleY;
  }

  oneStepTowards135(id, pid) {
    window.PLAYERS[id].myPieces[pid].x -= 50 * scaleX;
    window.PLAYERS[id].myPieces[pid].y -= 50 * scaleY;
  }

  oneStepTowards225(id, pid) {
    window.PLAYERS[id].myPieces[pid].x -= 50 * scaleX;
    window.PLAYERS[id].myPieces[pid].y += 50 * scaleY;
  }

  oneStepTowards315(id, pid) {
    window.PLAYERS[id].myPieces[pid].x += 50 * scaleX;
    window.PLAYERS[id].myPieces[pid].y += 50 * scaleY;
  }

  kill() {
    this.x = allPiecesePos[this.color_id][this.Pid].x;
    this.y = allPiecesePos[this.color_id][this.Pid].y;
    this.pos = -1;
  }
}



socket.on("connect", function () {
  console.log("You are connected to the server!!");

  socket.emit("fetch", room_code, function (data, id) {
    MYROOM = data.sort(function (a, b) {
      return a - b;
    });
    for (let i = 0; i < MYROOM.length; i++) {
      MYROOM[i] = +MYROOM[i];
    }
    myid = id;
    console.log("19/6/21 fetched:", MYROOM, myid, chance);
    StartTheGame();
   
  });

  //To simulate dice
  if (chance === myid) {
    document
      .querySelector("#randomButt")
      .addEventListener("click", function (event) {
        event.preventDefault();
        rollDice();
        console.log("19/6/21 randomButt clicked");
        styleButton(0);
        diceAction();
      });
  }

  socket.on("is-it-your-chance", function (data) {
    clearTimeout(avatarTimeout);
    clearTimeout(diceTimeout);

    if (data === myid) {
        togglePlayerTurn(true);
        styleButton(1);
        outputMessage({ Name: "your", id: data }, 4);

        // Set a timeout for 10 seconds
        diceTimeout = setTimeout(() => {
            socket.emit("chance", {
                room: room_code,
                nxt_id: chanceRotation(myid, 0) // Assuming 0 can be used to indicate no roll
            });
            togglePlayerTurn(false); // Player's turn ends after rolling
            styleButton(0);

            clearTimeout(avatarTimeout);
            clearTimeout(diceTimeout);

            remaningChance -= 1; // Decrement remainingChance
            localStorage.setItem("remaningChance", remaningChance); // Update localStorage with the new value
            showRemaningDots();
            console.log("Timeout reached, next chance");
        }, 20000); // 10 seconds
    } else {
        outputMessage({ Name: USERNAMES[data] + "'s", id: data }, 4);
        togglePlayerTurn(false);
    }

    chance = Number(data);
    window.localStorage.setItem("chance", chance.toString());
});


  socket.on("new-user-joined", function (data) {
    clearTimeout(JoinTimeOut);
    MYROOM.push(data.id);
    MYROOM = [...new Set(MYROOM)];
    MYROOM.sort(function (a, b) {
      return a - b;
    });
    for (let i = 0; i < MYROOM.length; i++) {
      MYROOM[i] = +MYROOM[i];
    }
    loadNewPiece(data.id);
    outputMessage({ Name: USERNAMES[data.id], id: data.id }, 0);
    hideLoader();
     togglePlayerTurn(true);
     styleButton(1);
    //stop timer,and hide modal.
    document.getElementById("myModal-2").style.display = "none";
    let butt = document.getElementById("WAIT");
    butt.disabled = false;
    butt.style.opacity = 1;
    butt.style.cursor = "pointer";
    clearInterval(window.timer);
  });

  // socket.on("user-disconnected", async function (data) {
  //   showLoader();
  //   await userWinn();
  //   hideLoader();
  //   outputMessage({ Name: USERNAMES[data], id: data }, 6);
  //   resumeHandler(data);
  // });

  socket.on("user-disconnected", async function (data) {
    showLoader();
    // swal({
    //      title: "Oppes..",
    //       text: `Please wait for 30 second to rejoin after 30 second you will winn the match`,
    //       icon: "warning",
    //       buttons: true,
    //       dangerMode: true,
    //     })
    //     .then((willDelete) => {
    //       if (willDelete) {
    //         return  showLoader();
    //       }else{
    //        return  showLoader();
    //       }
    //     });
    // Wait for 30 seconds before proceeding
    setTimeout(async () => {
      await userWinn();
      hideLoader();
      outputMessage({ Name: USERNAMES[data], id: data }, 6);
      resumeHandler(data);
    }, 1000);
  });

  socket.on("user-disconnected-popup", async function (data) {
    
    // swal({
    //      title: "Oppes..",
    //       text: `Please wait for 30 second to rejoin after 30 second you will winn the match`,
    //       icon: "warning",
    //       buttons: true,
    //       dangerMode: true,
    //     })
    //     .then((willDelete) => {
    //       if (willDelete) {
    //         return  
    //       }else{
    //        return
    //       }
    //     });

    showLoader();
    clearTimeout(avatarTimeout);
    clearTimeout(diceTimeout);
   
    // Wait for 30 seconds before proceeding
    
  });


  socket.on("rolled-dice", function (data) {
    Number(data.id) != myid
      ? outputMessage(
          { Name: USERNAMES[data.id], Num: data.num, id: data.id },
          1
        )
      : outputMessage({ Name: "you", Num: data.num, id: data.id }, 1);
    rollDice();
  });

  // socket.on("Thrown-dice", async function (data) {
  //   console.log(data);
  //   await PLAYERS[data.id].myPieces[data.pid].update(data.num);
  //   console.log("didIwin", PLAYERS[data.id].didIwin())
  //   if (PLAYERS[data.id].didIwin()) {
  //     socket.emit("WON", {
  //       room: data.room,
  //       id: data.id,
  //       player: myid,
  //       token: urlParams.get("token"),
  //       game_id: urlParams.get("game_id"),
  //     });
  //   }
  // });

  // Main game logic
socket.on("Thrown-dice", async function (data) {
  console.log(`Handling move for player ${data.id}, piece ${data.pid}, move ${data.num}`);
  const pieceReachedEnd = await PLAYERS[data.id].myPieces[data.pid].update(data.num);
  
  if (pieceReachedEnd) {
    console.log(`Piece ${data.pid} reached end. Checking if player ${data.id} won.`);
    if (PLAYERS[data.id].didIwin()) {
      console.log(`Player ${data.id} has won!`);
      socket.emit("WON", {
        room: data.room,
        id: data.id,
        player: myid,
        token: urlParams.get("token"),
        game_id: urlParams.get("game_id"),
      });
    }
  }
})

  socket.on("winner", async function (data) {
    //showToast(`you are the winner ${USERNAMES[id]}`);
    console.log(data);
    showLoader();
    await userLiveWinn(data.token, data.game_id);
    hideLoader();
  });

  socket.on("oppnentLose", async function (data) {
    swal({
      title: "Loser",
      text: `You lose 🤦‍♂️`,
      icon: "error",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {

        console.log(response);
        window.location.href = `https://ludowinners.in/viewgame/${urlParams.get(
          "game_id"
        )}`;
      } else {
        console.log(response);
        window.location.href = `https://ludowinners.in/viewgame/${urlParams.get(
          "game_id"
        )}`;
      }
    });    
  });

  async function userLiveWinn(t, g) {
    const headers = {
      Authorization: `Bearer ${t}`,
      "Content-Type": "application/json", // Ensure the Content-Type header is set for JSON
    };
    try {
      const response = await fetch(`/challange/result/live/${g}`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          status: "winn",
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      await sendWebSocketMessage("pageReloadSocketCall");

      socket.emit("Lose", {
        room: data.room,
        id: data.id,
        player: myid,
        token: urlParams.get("token"),
        game_id: urlParams.get("game_id"),
      });

      swal({
        title: "Winner",
        text: `you are the winner`,
        icon: "success",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {

          console.log(response);
          window.location.href = `https://ludowinners.in/viewgame/${urlParams.get(
            "game_id"
          )}`;
        } else {
          console.log(response);
          window.location.href = `https://ludowinners.in/viewgame/${urlParams.get(
            "game_id"
          )}`;
        }
      });
    } catch (e) {
      console.log(e);
      alert("There was an error winning the game.");
    }
  }

  socket.on("imposter", () => {
    window.localStorage.clear();
    window.location.href = `https://ludowinners.in/viewgame/${urlParams.get(
      "game_id"
    )}`;
  });
  
});

// To know if the client has disconnected with the server
socket.on("disconnect", function () {
  console.log("You are disconnected from the server");
});

var randomPiceNumber;
//Output the message through DOM manipulation
var randomPiceNumber;
var player1Set = false; // Track if player1 is set

//Output the message through DOM manipulation
function outputMessage(anObject, k) {
  let msgBoard = document.querySelector(".msgBoard");

  if (
    k === 1 &&
    !(
      anObject.Name.includes("<") ||
      anObject.Name.includes(">") ||
      anObject.Name.includes("/")
    )
  ) {
    const div = document.createElement("div");
    div.classList.add("message");
    div.innerHTML = `<p><strong>&#9733;  <span id="color-message-span1" style="text-shadow: 0 0 4px ${
      colors[anObject.id]
    };">${anObject.Name}</span></strong><span id="color-message-span2"> got a ${
      anObject.Num
    }</span></p>`;
    randomPiceNumber = anObject.Num;
    msgBoard.appendChild(div);
  } else if (
    k === 0 &&
    !(
      anObject.Name.includes("<") ||
      anObject.Name.includes(">") ||
      anObject.Name.includes("/")
    )
  ) {
    const div = document.createElement("div");
    div.classList.add("messageFromServer");
    div.innerHTML = `<p>&#8605;  <span id="color-message-span1" style="text-shadow: 0 0 4px ${
      colors[anObject.id]
    };">${
      anObject.Name
    }</span><span id="color-message-span2"> entered the game</span></p>`;
    msgBoard.appendChild(div);
    if (!player1Set) {
      document.getElementById("player1").innerHTML = `
        <div>
          <img class="AvatarSize" id="isPlayer1" style="border: 2px solid white; border-radius: 50%;" src="../images/avatar/Avatar1.png" alt="">
        </div>    
        <div class="">
          <span class="text-white" id="color-message-span1" style="text-shadow: 0 0 4px ${
            colors[anObject.id]
          };">${anObject.Name}</span>
          <span id="color-message-span2"></span>
          <img style="width: 15px" src="../images/pieces/${
            colors[anObject.id]
          }.png" alt="${anObject.Name} Piece">
        </div>
        <div id="remaningDots1">
          <img style="width: 40px" src="../images/dots/five.png" alt="dots">
        </div> 
      `;
      player1Set = true;
    } else {
      document.getElementById("player2").innerHTML = `            
        <div>
          <img class="AvatarSize" id="isPlayer2" style="border: 2px solid white; border-radius: 50%;" src="../images/avatar/Avatar6.png" alt="">
        </div>    
        <div class="">
          <span class="text-white" id="color-message-span1" style="text-shadow: 0 0 4px ${
            colors[anObject.id]
          };">${anObject.Name}</span>
          <span id="color-message-span2"></span>
          <img style="width: 15px" src="../images/pieces/${
            colors[anObject.id]
          }.png" alt="${anObject.Name} Piece">
        </div>
        <div id="remaningDots2">
          <img style="width: 40px" src="../images/dots/five.png" alt="dots">
        </div>                   
      `;
    }
  } else if (k === 3) {
    const div = document.createElement("div");
    div.classList.add("messageFromServer");
    div.innerHTML = `<span id="color-message-span2" style="text-shadow: 0 0 4px ${colors[myid]};">${anObject}!!</span>`;
    msgBoard.appendChild(div);
  } else if (k === 4) {
    const div = document.createElement("div");
    div.classList.add("messageFromServer");
    div.innerHTML = `<p><span id="color-message-span2">Its </span><span id="color-message-span1" style="text-shadow: 0 0 4px ${
      colors[anObject.id]
    };">${
      anObject.Name
    }</span><span id="color-message-span2"> chance!!</span></p>`;
    msgBoard.appendChild(div);
  } else if (k === 5) {
    const div = document.createElement("div");
    div.classList.add("messageFromServer");
    div.innerHTML = `<span id="color-message-span2" style="text-shadow: 0 0 4px ${
      colors[anObject.id]
    };">${anObject.msg}!!</span>`;
    msgBoard.appendChild(div);
  } else if (k === 6) {
    const div = document.createElement("div");
    div.classList.add("messageFromServer");
    div.innerHTML = `<p>&#8605;  <span id="color-message-span1" style="text-shadow: 0 0 4px ${
      colors[anObject.id]
    };">${
      anObject.Name
    }</span><span id="color-message-span2"> just left the game</span></p>`;
    msgBoard.appendChild(div);
  }
  msgBoard.scrollTop = msgBoard.scrollHeight - msgBoard.clientHeight;
}

async function showRemaningDots() {
  const remaningDots1 = document.getElementById("remaningDots1");
  const remaningDots2 = document.getElementById("remaningDots2");
  
  const dotImages = ["one.png", "two.png", "three.png", "four.png", "five.png"];
  const currentDotsImage = remaningChance >= 1 && remaningChance <= 5 ? dotImages[remaningChance - 1] : "zero.png";
  
  if (remaningChance === 0) {
    showLoader();
    clearTimeout(avatarTimeout);
    clearTimeout(diceTimeout); // Clear the timeout when the player rolls the dice
   await userLose();
   hideLoader();
  }


  if (remaningDots1) {
    remaningDots1.innerHTML = `<img style="width: 40px" src="../images/dots/${currentDotsImage}" alt="dots">`;
  }
  
  if (remaningDots2) {
    remaningDots2.innerHTML = `<img style="width: 40px" src="../images/dots/${currentDotsImage}" alt="dots">`;
  }
}

function rollDice() {
  const dice = document.getElementById("randomButt");
  var dicesoundMusic = document.getElementById("dicesoundMusic");
  dicesoundMusic.play();

  dice.classList.add("rolling");

  let imgName = ["one", "two", "three", "four", "five", "six"];

  setTimeout(() => {
    // const randomNumber = Math.floor(Math.random() * 6) + 1;
    dice.src = `../images/dice/${imgName[randomPiceNumber - 1]}.png`;
    dice.classList.remove("rolling");
  }, 300);
}

function diceAction() {
  clearTimeout(avatarTimeout);
  clearTimeout(diceTimeout); // Clear the timeout when the player rolls the dice
  socket.emit("roll-dice", { room: room_code, id: myid }, function (num) {
    console.log("Dice rolled, got", num);
    let spirit = [];
    let allAtHome = true;
    let canMoveOut = false;

   // Check for valid moves and animate valid pieces
    for (let i = 0; i < 4; i++) {
      let piece = PLAYERS[myid].myPieces[i];
      if (piece.pos > -1 && piece.pos + num <= 56) {
        spirit.push(i);
        piece.bounceAnimation(); // Animate valid pieces
      }
      if (piece.pos != -1) {
        allAtHome = false;
      }
      if (num == 6 && piece.pos == -1) {
        canMoveOut = true;
        piece.bounceAnimation(); // Animate pieces that can move out
      }
    }

    // If all pieces are at home, and a 6 is rolled, and no pieces can move out, call the next chance
    if (allAtHome && num == 6 && !canMoveOut) {
      socket.emit("chance", {
        room: room_code,
        nxt_id: chanceRotation(myid, 0),
      });
      console.log("Next chance");
      return;
    }

    if (spirit.length != 0 || (num == 6 && canMoveOut)) {
      outputMessage("Click on a piece", 3);

      // Remove existing event listeners to avoid duplicates
      canvas.removeEventListener("click", clickHandler);

      canvas.addEventListener("click", clickHandler);

      async function clickHandler(e) {
        // var piceSound = document.getElementById("piceSound");
        // piceSound.play();
        console.log("Click event listener triggered");

        let Xp = e.clientX - e.target.getBoundingClientRect().left;
        let Yp = e.clientY - e.target.getBoundingClientRect().top;
        let playerObj = {
          room: room_code,
          id: myid,
          num: num,
        };
        let alert1 = true;

        for (let i = 0; i < 4; i++) {
          if (
            Xp - PLAYERS[myid].myPieces[i].x < 45 &&
            Xp - PLAYERS[myid].myPieces[i].x > 0 &&
            Yp - PLAYERS[myid].myPieces[i].y < 45 &&
            Yp - PLAYERS[myid].myPieces[i].y > 0
          ) {
            console.log(i, "Piece clicked");
            if (
              (spirit.includes(i) ||
                (num == 6 && PLAYERS[myid].myPieces[i].pos == -1)) &&
              PLAYERS[myid].myPieces[i].pos + num <= 56
            ) {
              playerObj["pid"] = i;
              console.log(playerObj);
              socket.emit("random", playerObj, function (data) {
                styleButton(0);
                console.log("random acknowledged");
                socket.emit("chance", {
                  room: room_code,
                  nxt_id: chanceRotation(myid, data),
                });
              });
              canvas.removeEventListener("click", clickHandler);
              return;
            } else {
              showToast("Please click on a valid Piece.");
              alert1 = false;
              break;
            }
          }
        }

        if (alert1) {
          showToast("You need to click on a piece of your color");
        }
      }
    } else {
      let nextId = chanceRotation(myid, num);
      console.log(`No valid moves. Next chance goes to player ${nextId}`);
      socket.emit("chance", {
        room: room_code,
        nxt_id: nextId,
      });
      console.log("else last call Next chance",{room: room_code,
        nxt_id: chanceRotation(myid, num)});
    }
  });
}

// function diceAction() {
//     socket.emit('roll-dice', { room: room_code, id: myid }, function(num) {
//         console.log('19/6/21 dice rolled, got', num);
//         let spirit = [];
//         let allAtHome = true;
//         let canMoveOut = false;

//         // Check if there are any pieces that can move
//         for (let i = 0; i < 4; i++) {
//             if (PLAYERS[myid].myPieces[i].pos > -1 && PLAYERS[myid].myPieces[i].pos + num <= 56) {
//                 spirit.push(i);
//             }
//             if (PLAYERS[myid].myPieces[i].pos != -1) {
//                 allAtHome = false;
//             }
//             if (num == 6 && PLAYERS[myid].myPieces[i].pos == -1) {
//                 canMoveOut = true;
//             }
//         }

//         // If all pieces are at home, and a 6 is rolled, and no pieces can move out, call the next chance
//         if (allAtHome && num == 6 && !canMoveOut) {
//             socket.emit('chance', { room: room_code, nxt_id: chanceRotation(myid, num) });
//             console.log('19/6/21 next chance');
//             return;
//         }

//         if (spirit.length != 0 || (num == 6 && canMoveOut)) {
//             outputMessage('Click on a piece', 3);
//             canvas.addEventListener('click', function clickHandler(e) {
//                 var piceSound = document.getElementById('piceSound');
//                 piceSound.play();
//                 console.log('19/6/21 click event listener added to canvas element');
//                 let Xp = e.clientX - e.target.getBoundingClientRect().left;
//                 let Yp = e.clientY - e.target.getBoundingClientRect().top;
//                 let playerObj = {
//                     room: room_code,
//                     id: myid,
//                     num: num
//                 };
//                 let alert1 = true;

//                 for (let i = 0; i < 4; i++) {
//                     if (Xp - PLAYERS[myid].myPieces[i].x < 45 && Xp - PLAYERS[myid].myPieces[i].x > 0 && Yp - PLAYERS[myid].myPieces[i].y < 45 && Yp - PLAYERS[myid].myPieces[i].y > 0) {
//                         console.log(i, 'okokokok');
//                         if ((spirit.includes(i) || (num == 6 && PLAYERS[myid].myPieces[i].pos == -1)) && PLAYERS[myid].myPieces[i].pos + num <= 56) {
//                             playerObj['pid'] = i;
//                             console.log(playerObj);
//                             socket.emit('random', playerObj, function(data) {
//                                 styleButton(0);
//                                 console.log('random acknowledged');
//                                 socket.emit('chance', { room: room_code, nxt_id: chanceRotation(myid, data) });
//                             });
//                             canvas.removeEventListener('click', clickHandler);
//                             return 0;
//                         } else {
//                             showToast('Please click on a valid Piece.');
//                             // swal("Error!", "Please click on a valid Piece.!", "error");
//                             alert1 = false;
//                             break;
//                         }
//                     }
//                 }

//                 if (alert1) {
//                     showToast('You need to click on a piece of your color');
//                 }
//             });
//         } else {
//             socket.emit('chance', { room: room_code, nxt_id: chanceRotation(myid, num) });
//             console.log('19/6/21 next chance');
//         }
//     });
// }

// --------

// function togglePlayerTurn(isPlayer1Turn) {
//   const player1 = document.getElementById("isPlayer1");
//   const player2 = document.getElementById("isPlayer2");

//   if (isPlayer1Turn) {
//     player1.style.border = "3px solid yellow";
//     player2.style.border = "none";
//   } else {
//     player1.style.border = "none";
//     player2.style.border = "3px solid yellow";
//   }
// }

function togglePlayerTurn(isPlayer1Turn) {
  const player1 = document.getElementById("isPlayer1");
  const player2 = document.getElementById("isPlayer2");

  // Remove the animation class from both players
  player1.classList.remove("animated-border");
  player2.classList.remove("animated-border");

  if (isPlayer1Turn) {
    player1.style.border = "3px solid yellow";
    player2.style.border = "none";
    player1.classList.add("animated-border");
  } else {
    player1.style.border = "none";
    player2.style.border = "3px solid yellow";
    player2.classList.add("animated-border");
  }

  // Stop the animation after 10 seconds
  avatarTimeout = setTimeout(() => {
    player1.classList.remove("animated-border");
    player2.classList.remove("animated-border");
  }, 20000); // 10 seconds
}



// Initialise the game with the one who created the room.
function StartTheGame() {
  // Set up player messages and UI
  MYROOM.forEach(function (numb) {
    numb === myid
      ? outputMessage({ Name: "You", id: numb }, 0)
      : outputMessage({ Name: USERNAMES[numb], id: numb }, 0);
  });
  document.getElementById("my-name").innerHTML += USERNAMES[myid];
  console.log(myid); // my-name
  let copyText = `\n\nMy room:\n${window.location.href} \nor join the room via\nMy room code:${room_code}`;
  document.getElementById("copy").innerHTML += copyText;

  // Check the number of players
  if (MYROOM.length === 1) {
    togglePlayerTurn(true);
    styleButton(1);
    chance = Number(myid);
  } else {
    togglePlayerTurn(false);
    styleButton(0);
  }

  // Clear any existing timeout before setting a new one
  if (JoinTimeOut) {
    clearTimeout(JoinTimeOut);
  }

  // Set a new timeout
  JoinTimeOut = setTimeout(async () => {
    // alert("Match cancel not join anyone")
    await notJoinCancelGame();
  }, 60000);

  showLoader();

  // Hide loader and clear timeout if there are 2 players
  if (MYROOM.length === 2) {
    hideLoader();
    if (JoinTimeOut) {
      clearTimeout(JoinTimeOut);
      console.log("Timeout cleared"); // Debugging line
    }
  }

  loadAllPieces();
}

//button disabling-enabling
function styleButton(k) {
  let butt = document.getElementById("randomButt");
  let overlay = document.getElementById("overlay");
  if (k === 0) {
    butt.style.opacity = 0.6;
    overlay.style.display = "block";
  } else if (k === 1) {
    butt.style.opacity = 1;
    overlay.style.display = "none";
  }
}

//Load all the images of the pieces
function loadAllPieces() {
  let cnt = 0;
  for (let i = 0; i < colors.length; i++) {
    let img = new Image();
    img.src = "../images/pieces/" + colors[i] + ".png";
    img.onload = () => {
      ++cnt;
      if (cnt >= colors.length) {
        //all images are loaded
        for (let j = 0; j < MYROOM.length; j++) {
          PLAYERS[MYROOM[j]] = new Player(MYROOM[j]);
        }
        if (window.localStorage.getItem("room") == room_code) {
          console.log("19/6/21 yes my localStorage is for this room");
          if (window.localStorage.getItem("started") == "true") {
            console.log("19/6/21 yes i from this room");
            chance = Number(window.localStorage.getItem("chance"));
            let positions = JSON.parse(
              window.localStorage.getItem("positions")
            );
            let win = JSON.parse(window.localStorage.getItem("win"));
            for (let i = 0; i < MYROOM.length; i++) {
              PLAYERS[MYROOM[i]].win = Number(MYROOM[i]);
              for (let j = 0; j < 4; j++) {
                console.log(
                  "19/6/21 yes room==room_code && started==true:i,j:",
                  i,
                  j
                );
                PLAYERS[MYROOM[i]].myPieces[j].x = Number(
                  positions[MYROOM[i]][j].x
                );
                PLAYERS[MYROOM[i]].myPieces[j].y = Number(
                  positions[MYROOM[i]][j].y
                );
                PLAYERS[MYROOM[i]].myPieces[j].pos = Number(
                  positions[MYROOM[i]][j].pos
                );
              }
            }
            allPlayerHandler();
          } else {
            allPlayerHandler();
          }
        } else {
          // window.localStorage.clear();
          window.localStorage.setItem("room", room_code);
          allPlayerHandler();
        }
      }
    };
    PIECES.push(img);
  }
}

//rotate chance, required for the game
function chanceRotation(id, num) {
  if (num == 6) {
    console.log("Next chance (num==6):", id);
    return id;
  } else {
    let currentIndex = MYROOM.indexOf(parseInt(id));
    let nextIndex = (currentIndex + 1) % MYROOM.length;
    let nextPlayer = MYROOM[nextIndex];

    console.log("Current player:", id);
    console.log("MYROOM:", MYROOM);
    console.log("Next player:", nextPlayer);
    console.log("Previous chance:", chance);

    // Update the global chance variable
    chance = nextIndex;

    return nextPlayer;
  }
}

//draws 4 x 4 = 16 pieces per call
function allPlayerHandler() {
  console.log("all player handler");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < Object.keys(PLAYERS).length; i++) {
    PLAYERS[MYROOM[i]].draw();
  }
  //Store chance, all 16 pos
  //a boolean, for if this function has been called atleast once
  let positions = {};
  let win = {};
  for (let i = 0; i < MYROOM.length; i++) {
    positions[MYROOM[i]] = {};
    win[MYROOM[i]] = PLAYERS[MYROOM[i]].win;
    for (let j = 0; j < 4; j++) {
      positions[MYROOM[i]][j] = {
        x: PLAYERS[MYROOM[i]].myPieces[j].x,
        y: PLAYERS[MYROOM[i]].myPieces[j].y,
        pos: PLAYERS[MYROOM[i]].myPieces[j].pos,
      };
    }
  }
  window.localStorage.setItem("started", "true");
  window.localStorage.setItem("chance", chance.toString());
  window.localStorage.setItem("positions", JSON.stringify(positions));
  window.localStorage.setItem("win", JSON.stringify(win));
}

//Load a new Player instance
function loadNewPiece(id) {
  PLAYERS[id] = new Player(id);
  if (window.localStorage.getItem("room") == room_code) {
    console.log("19/6/21 yes I'm from our room");
    if (window.localStorage.getItem("started")) {
      //chance = Number(window.localStorage.getItem('chance'));
      console.log("19/6/21 yes i have already started the game");
      let positions = JSON.parse(window.localStorage.getItem("positions"));
      let win = JSON.parse(window.localStorage.getItem("win"));
      if (positions[id]) {
        console.log(
          `yes I have some data for user of id: ${id} in my local storage\nIt is ${positions[id]}`
        );
        PLAYERS[id].win = Number(win[id]);
        for (let j = 0; j < 4; j++) {
          console.log(
            `19/6/21 for ${id},${j}\nx:${Number(
              positions[id][j].x
            )}\ny:${Number(positions[id][j].y)}\npos:${Number(
              positions[id][j].pos
            )}`
          );
          PLAYERS[id].myPieces[j].x = Number(positions[id][j].x);
          PLAYERS[id].myPieces[j].y = Number(positions[id][j].y);
          PLAYERS[id].myPieces[j].pos = Number(positions[id][j].pos);
        }
      }
    }
  }
  allPlayerHandler();
}

function iKill(id, pid) {
  let boss = PLAYERS[id].myPieces[pid];
  for (let i = 0; i < MYROOM.length; i++) {
    for (let j = 0; j < 4; j++) {
      if (
        MYROOM[i] != id &&
        boss.x == PLAYERS[MYROOM[i]].myPieces[j].x &&
        boss.y == PLAYERS[MYROOM[i]].myPieces[j].y
      ) {
        if (!inAhomeTile(id, pid)) {
          PLAYERS[MYROOM[i]].myPieces[j].kill();
          return 1;
        }
      }
    }
  }
  return 0;
}

function inAhomeTile(id, pid) {
  for (let i = 0; i < 4; i++) {
    if (
      (PLAYERS[id].myPieces[pid].x == homeTilePos[i][0].x &&
        PLAYERS[id].myPieces[pid].y == homeTilePos[i][0].y) ||
      (PLAYERS[id].myPieces[pid].x == homeTilePos[i][1].x &&
        PLAYERS[id].myPieces[pid].y == homeTilePos[i][1].y)
    ) {
      return true;
    }
  }

  return false;
}

function resumeHandler(id) {
  // document.getElementById("myModal-2").style.display = "block";
  // //who left+timer!
  // let theOneWhoLeft = document.getElementById('theOneWhoLeft');
  // let seconds = document.getElementById('seconds');
  // let i = 10
  // theOneWhoLeft.innerHTML = USERNAMES[id]
  // theOneWhoLeft.style.textShadow = `0 0 4px ${colors[id]}`;
  // document.getElementById('RESUME').onclick = function(){
  //     resume(id);
  //     socket.emit('resume',{
  //         room:room_code,
  //         id:id,
  //         click:myid
  //     },function(){
  //         outputMessage({id:myid,msg:`You have resumed the game without ${USERNAMES[id]}`},5);
  //         if(chance==id){
  //             socket.emit('chance',{room: room_code, nxt_id: chanceRotation(id,0)});
  //         }
  //     });

  // };
  // document.getElementById('WAIT').onclick = function(){
  //     wait();
  //     socket.emit('wait',{
  //         room:room_code,
  //         click:myid
  //     },function(){
  //         outputMessage({id:myid,msg:`You have decided to wait`},5)
  //     });

  // };
  // window.timer = setInterval(function(){
  //     i-=1;
  //     seconds.innerHTML = ` in ${i}`;
  //     if(i==0){
  //         resume(id);
  //         socket.emit('resume',{
  //             room:room_code,
  //             id:id,
  //             click:id
  //         },function(){
  //             outputMessage({id:id,msg:`Resumed the game without ${USERNAMES[id]}`},5);
  //             if(chance==id){
  //                 socket.emit('chance',{room: room_code, nxt_id: chanceRotation(id,0)});
  //             }
  //         });

  //     }
  // }, 1000)
  swal({
    title: "Congratulations",
    text: `you are the winner ${USERNAMES[id]}`,
    icon: "success",
    buttons: true,
    dangerMode: true,
  }).then((willDelete) => {
    if (willDelete) {
      window.location.href = `https://ludowinners.in/viewgame/${urlParams.get(
        "game_id"
      )}`;
    } else {
      window.location.href = `https://ludowinners.in/viewgame/${urlParams.get(
        "game_id"
      )}`;
    }
  });
}

function showToast(message) {
  var toast = document.getElementById("toast");
  toast.textContent = message; // Set the message content
  toast.classList.add("show");
  setTimeout(function () {
    toast.classList.remove("show");
  }, 3000); // Adjust the timeout as needed
}

async function cancelGame() {
  swal({
    title: "Are you sure?",
    text: "Once exist, you will lose this match!",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  }).then(async (willDelete) => {
    if (willDelete) {
      // const headers = {
      //     Authorization: `Bearer ${urlParams.get('token')}`,
      //     'Content-Type': 'application/json'
      // };
      // try {
      //     const response = await fetch(`/challange/result/live/${urlParams.get('game_id')}`, {
      //         method: 'POST',
      //         headers: headers,
      //         body: JSON.stringify({
      //             status: "cancelled"
      //         })
      //     });

      //     if (!response.ok) {
      //         throw new Error('Network response was not ok');
      //     }

      //     const responseData = await response.json();
      //     console.log(responseData);

      //     await sendWebSocketMessage('pageReloadSocketCall');
      //     alert("The game has been successfully cancelled.");

      //   window.location.href = `https://ludowinners.in/viewgame/${urlParams.get('game_id')}`
      // } catch (error) {
      //     console.error("Error cancelling the game:", error);
      //     alert("There was an error cancelling the game.");

      //   window.location.href = `https://ludowinners.in/viewgame/${urlParams.get('game_id')}`
      // }

      window.location.href = `https://ludowinners.in/viewgame/${urlParams.get(
        "game_id"
      )}`;
    } else {
      return;
    }
  });
}

async function notJoinCancelGame() {
 
      const headers = {
          Authorization: `Bearer ${urlParams.get('token')}`,
          'Content-Type': 'application/json'
      };
      try {
          const response = await fetch(`/challange/result/live/${urlParams.get('game_id')}`, {
              method: 'POST',
              headers: headers,
              body: JSON.stringify({
                  status: "cancelled"
              })
          });

          if (!response.ok) {
              throw new Error('Network response was not ok');
          }

          const responseData = await response.json();
          console.log(responseData);

          await sendWebSocketMessage('pageReloadSocketCall');
          alert("The game has been successfully cancelled.");

        window.location.href = `https://ludowinners.in/viewgame/${urlParams.get('game_id')}`
      } catch (error) {
          console.error("Error cancelling the game:", error);
          alert("There was an error cancelling the game.");

        window.location.href = `https://ludowinners.in/viewgame/${urlParams.get('game_id')}`
      }
}

async function userLose() {
  const headers = {
    Authorization: `Bearer ${urlParams.get("token")}`,
    "Content-Type": "application/json", // Ensure the Content-Type header is set for JSON
  };
  try {
    const response = await fetch(
      `/challange/result/live/${urlParams.get("game_id")}`,
      {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          status: "lose",
        }),
      }
    );

    if (!response.ok) {
      alert("Network response was not ok");
      throw new Error("Network response was not ok");
    }

    hideLoader();
    await sendWebSocketMessage("pageReloadSocketCall");
    console.log(response);
    swal({
      title: "Time out...",
      text: "You lose this match.",
      icon: "error",
    }).then(() => {
      setTimeout(() => {
        window.location.href = `https://ludowinners.in/viewgame/${urlParams.get("game_id")}`;
      }, 1000); // 5000 milliseconds = 5 seconds
    });
    
  } catch (e) {
    console.log(e);
    alert("There was an error cancelling the game.");
  }
}
async function userWinn() {
  const headers = {
    Authorization: `Bearer ${urlParams.get("token")}`,
    "Content-Type": "application/json", // Ensure the Content-Type header is set for JSON
  };
  try {
    const response = await fetch(
      `/challange/result/live/${urlParams.get("game_id")}`,
      {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          status: "winn",
        }),
      }
    );

    if (!response.ok) {
      alert("Network response was not ok");
      throw new Error("Network response was not ok");
    }

    hideLoader();
    await sendWebSocketMessage("pageReloadSocketCall");
    console.log(response);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
    swal({
      title: "Congratulations",
      text: `You are ths winner of this game opponent left the game.`,
      icon: "success",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        window.location.href = `https://ludowinners.in/viewgame/${urlParams.get(
          "game_id"
        )}`;
      } else {
        window.location.href = `https://ludowinners.in/viewgame/${urlParams.get(
          "game_id"
        )}`;
      }
    });
  } catch (e) {
    console.log(e);
    alert("There was an error cancelling the game.");
    window.localStorage.clear();
  }
}

function showLoader() {
  document.getElementById("loader").style.display = "flex";
  document.getElementById("content").style.display = "none";
}

function hideLoader() {
  document.getElementById("loader").style.display = "none";
  document.getElementById("content").style.display = "block";
}

//  window.addEventListener('beforeunload', function() {
//     // Clear all cookies
//     const cookies = document.cookie.split(";");
//     for (let i = 0; i < cookies.length; i++) {
//       const cookie = cookies[i];
//       const eqPos = cookie.indexOf("=");
//       const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
//       document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
//     }

//     // Clear localStorage
//     localStorage.clear();
//   });

setTimeout(() => {
  async function setPice() {
    // Assuming urlParams is already defined and initialized somewhere in your code
    const token = urlParams.get('token');
    const gameId = urlParams.get('game_id');
    
    if (!token || !gameId) {
        console.error("Token or game_id is missing");
        return;
    }
  
    const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
    
    try {
        const response = await fetch(`/challange/pice/number/update/live/${gameId}`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                liveGamePiceNumber: myid
            })
        });
  
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
  
        const responseData = await response.json();
        console.log(responseData);
    } catch (error) {
        console.error("Error updating the piece number:", error);
    }
  };
  
  setPice();
}, 2000);

