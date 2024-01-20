const mongoose = require("mongoose");
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
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
