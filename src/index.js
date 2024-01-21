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
const Reply = require("./models/Reply.model");

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
      const allMessages = await Message.find({ user: user._id });
      socket.join(room);
      if (allMessages) {
        socket.emit("user_found", allMessages);
      }
    } else {
      const newUser = await new User({
        email: room,
      });
      newUser.save();
      socket.emit("user_created", newUser.email);

      socket.join(newUser.room);
    }
  });
  socket.on("send_message", async ({ email, message }) => {
    try {
      const user = await User.findOne({ email });

      if (!user) {
        console.error(`User not found for email: ${email}`);
        return;
      }

      const newMessage = await new Message({
        user: user._id,
        content: message,
        sender: email,
        recipient: "admin@gmail.com",
      });

      await newMessage.save();

      const allMessages = await Message.find({ user: user._id });
      socket.to(email).emit("received_message_client", allMessages);
    } catch (error) {
      console.error("Error in send_message handler:", error);
    }
  });

  // For Admin
  socket.on("login", async (email) => {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      socket.emit("admin_login_error", "Email not found");
    }

    const users = await User.find({});
    socket.emit("admin_login_success", users);
  });
  socket.on("admin_join_room", async ({ admin, clientEmail }) => {
    const user = await User.findOne({ email: clientEmail });
    if (user) {
      const allMessages = await Message.find({ user: user._id });
      if (allMessages) {
        socket.emit("admin_user_found", allMessages);
      }
      socket.join(admin);
    }
  });

  socket.on("admin_send_message", async ({ message, email }) => {
    const user = await User.findOne({ email });
    const newMessage = await new Message({
      user: user._id,
      content: message,
      recipient: email,
      sender: "admin@gmail.com",
    });

    newMessage.save();
    const allMessages = await Message.find({ user: user._id });
    socket.to(user.email).emit("received_message", allMessages);
  });

  socket.on(
    "admin_reply_specific_message",
    async ({ userEmail, messageId, repliedMessage }) => {
      const user = await User.findOne({ email: userEmail });

      const message = await Message.findByIdAndUpdate(
        messageId,
        {
          $push: {
            replies: repliedMessage,
          },
        },
        {
          new: true,
        }
      );

      message.save();
      const allMessages = await Message.find({ user: user._id }).populate(
        "replies"
      );

      socket.to(user.email).emit("received_message", allMessages);
    }
  );
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
