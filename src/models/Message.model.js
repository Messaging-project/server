const mongoose = require("mongoose");
const Reply = require("./Reply.model");
const User = require("./User.model");
const messageSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectID,
      ref: User,
    },
    sender: {
      type: String,
      required: true,
    },
    recipient: {
      type: String,
      required: true,
    },
    replies: [
      {
        type: String,
        required: false,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
