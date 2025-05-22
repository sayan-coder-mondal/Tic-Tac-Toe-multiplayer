const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const path = require('path');

const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static(path.resolve(("./public"))))

app.get('/', (req, res) => {
  return res.sendFile("/public/index.html")
});

//Socket.io
var roomNo = Math.floor(100000000000 + Math.random() * 900000000000);
var full = 0;

const rooms = {}; // To store room info with the count of users
var creatorId;
var joinerId;

io.on('connection', (socket) => {
  // console.log('a user connected '+socket.id);


  socket.on('searchRandomRoom', (data) => {
    if (data.search) {
      // io.sockets.in("room-"+roomNo).emit("connectedRoom",roomNo);

      full++;
      if (full > 2) {
        roomNo = Math.floor(100000000000 + Math.random() * 900000000000);
        full = 1;
      }

      // console.log("full " + full);

      if(rooms[roomNo]==full){    
        full++;
      }
      else if(rooms[roomNo]==2){
        roomNo = Math.floor(100000000000 + Math.random() * 900000000000);
        full = 1;
      }

      rooms[roomNo] = full;
      // socket.join("room-" + roomNo);

      if (full == 1) {
        socket.join("room-" + roomNo);
        // console.log(`Room ${roomNo} created by ${socket.id}`);
        io.to("room-" + roomNo).emit("connectedRoom", { roomCode: roomNo, creatorId: socket.id, turn: "X", roomSize: full });
        creatorId = socket.id;
        // console.log(rooms);
      }
      else {
        // console.log("check");
        
        // Retrieve the existing socket ID from the room
        const roomName = "room-" + roomNo;
        const roomObj = io.sockets.adapter.rooms.get(roomName);
        let existingSocketId = null;
        // console.log(roomObj);
        if (roomObj) {
          for (const id of roomObj) { // Directly iterate over the Set of socket IDs
            existingSocketId = id;
            break; // Get the first existing socket ID
          }
        }
        // Store the existing user's socket ID
        creatorId = existingSocketId;


        socket.join("room-" + roomNo);
        // console.log(`User joined room ${roomNo}`);
        io.to("room-" + roomNo).emit("connectedRoom", { roomCode: roomNo, creatorId, joinerId: socket.id, turn: "O", roomSize: full });
        joinerId = socket.id;
        // console.log(rooms);
      }
    }
  })


  // Join a room when creating or searching for it
  socket.on('createRoom', (roomCode) => {
    if(roomCode.length>8 || roomCode.length==0){
      return;
    }
    // Check if the room already exists
    if (rooms[roomCode]) {
      socket.emit('roomExists', roomCode); // Emit an alert to the client
      return;
    }

    // Create a new room and join
    rooms[roomCode] = 1;
    socket.join("room-" + roomCode);
    // console.log(`Room ${roomCode} created by ${socket.id}`);
    io.to("room-" + roomCode).emit("connectedRoom", { roomCode, creatorId: socket.id, turn: "X", roomSize: 1 });
    creatorId = socket.id;

    // console.log(rooms);
  });

  // Search and Join Room
  socket.on('searchRoom', (roomCode) => {
    if(roomCode.length>8 || roomCode.length==0){
      return;
    }
    // Check if the room exists
    if (!rooms[roomCode]) {
      socket.emit('noSuchRoom', roomCode); // Emit an alert to the client
      return;
    }

    // Check if the room is full
    const roomSize = rooms[roomCode];
    if (roomSize >= 2) {
      socket.emit('roomFull', roomCode); // Emit an alert to the client
      return;
    }



    // Retrieve the existing socket ID from the room
    const roomName = "room-" + roomCode;
    const roomObj = io.sockets.adapter.rooms.get(roomName);
    let existingSocketId = null;
    // console.log(roomObj);
    if (roomObj) {
      for (const id of roomObj) { // Directly iterate over the Set of socket IDs
        existingSocketId = id;
        break; // Get the first existing socket ID
      }
    }
    // Store the existing user's socket ID
    creatorId = existingSocketId;
    // console.log(`Existing user in room ${roomCode}: ${creatorId}`);



    // Join the existing room and update count
    rooms[roomCode]++;
    socket.join("room-" + roomCode);
    // console.log(`User joined room ${roomCode}`);
    io.to("room-" + roomCode).emit("connectedRoom", { roomCode, creatorId, joinerId: socket.id, turn: "O", roomSize: 2 });
    joinerId = socket.id;
    // console.log(rooms);
  });


  socket.on('userTurn', (data) => {
    if (data.turn == data.creatorId) {
      // console.log(data.joinerId);

      io.to("room-" + data.room).emit('serverTurn', { turn: data.joinerId, move: data.move });
    }
    else if (data.turn == data.joinerId) {
      io.to("room-" + data.room).emit('serverTurn', { turn: data.creatorId, move: data.move });
    }
  })


  socket.on('userNewGameEvent', (data) => {
    if (data.newGame == true) {
      io.to("room-" + data.room).emit('serverNewGameEvent', { newGame: true });
    }
  });


  // Handle disconnect
  socket.on('disconnect', () => {
    // Find all rooms and check which room the disconnected user was in
    // console.log(rooms);

    for (const roomCode in rooms) {
      const roomName = "room-" + roomCode;
      // console.log(roomName);

      const roomObj = io.sockets.adapter.rooms.get(roomName);
      // console.log(roomObj);


      if (roomObj) {
        const sizeBefore = rooms[roomCode]; // Old size (before update)

        // Update room size after user left
        rooms[roomCode] = roomObj.size;
        // console.log(`Room ${roomCode} still has ${roomObj.size} members.`);

        // Broadcast to the other user in the room
        // Only emit if someone else is still in the room
        if (roomObj.size === 1 && sizeBefore === 2) {
          socket.to(roomName).emit('leftRoomAlert', { exit: true });
        }
      } else if (!roomObj) {
        // No members left in the room, delete it
        delete rooms[roomCode];
        // console.log(`Room ${roomCode} deleted as no members are left.`);

        if (roomCode >= 100000000000 && roomCode <= 999999999999) {
          // console.log("Check");
          full = 0;
        }

      }
    }

    // console.log(rooms);

    // console.log("User disconnected:", socket.id);
  });
});

server.listen(4000, () => {
  // console.log('listening on *:4000');
});