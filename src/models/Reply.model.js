const mongoose = require("mongoose");


const replySchema = new mongoose.Schema({
  content: {
    type: String,
    required: false,
  },
  sender: {
    type: String,
    required: true,
  },
  recipient: {
    type: String,
    required: true,
  },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Reply", replySchema);
