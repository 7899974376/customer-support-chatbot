const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  conversation_id: String,
  role: { type: String, enum: ["user", "ai"] },
  text: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Message", messageSchema);
