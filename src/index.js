const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

// Importing models
const User = require("./models/User.model");
const Message = require("./models/Message.model");
const Admin = require("./models/Admin.model");

const app = express();
app.use(cors());

mongoose
  .connect(process.env.MONGODB_KEY)
  .then(() => console.log("Database Connected succssfully"))
  .catch((err) => console.log(err));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("join_room", async (room) => {
    const user = await User.findOne({ email: room });
    if (user) {
      const allMessages = await Message.find({ sender: user.id });
      socket.emit("user_found", allMessages);
      socket.join(user.email);
    } else {
      const newUser = await new User({
        email: room,
      });
      newUser.save();
      socket.emit("user_created", newUser.email);

      socket.join(room);
    }
  });

  socket.on("send_message", async ({ email, message }) => {
    const user = await User.findOne({ email });
    const newMessage = await new Message({
      sender: user._id,
      content: message,
    });

    newMessage.save();

    const allMessages = await Message.find({ sender: user.id });
    // socket.broadcast.emit("received_message", message);
    socket.to(user.email).emit("received_message", allMessages);
  });

  // For Admin
  socket.on("login", async (email) => {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      socket.emit("admin_login_error", "Email not found");
    }
    
    const users = await User.find({});
    console.log({users})
    socket.emit("admin_login_success", users);
  });
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
