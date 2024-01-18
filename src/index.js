const express = require("express");
const cors = require("cors");
const app = express();
const http = require("http");
const { Server } = require("socket.io");

app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("join_room", (room) => {
    socket.join(room);
  });

  socket.on("send_message", (message) => {
    // socket.broadcast.emit("received_message", message);
    socket.to(message.room).emit("received_message", message.message);
  });
});

server.listen(3001, () => {
  console.log("Server listening on port 3001");
});
