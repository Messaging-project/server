const mongoose = require("mongoose");
const User = require("./User.model");
const messageSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: false,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectID,
      ref: User,
    },
    // recipient: {
    //   type: mongoose.Schema.Types.ObjectID,
    //   ref: Admin,
    // },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
