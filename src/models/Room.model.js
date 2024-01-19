const mongoose = require("mongoose");
const User = require("./User.model");

const roomSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectID,
      ref: User,
    },
    roomName: {
      type: String,
      required: true
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Room", roomSchema);