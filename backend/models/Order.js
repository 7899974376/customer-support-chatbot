const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  order_id: { type: Number, unique: true },
  user_id: Number,
  status: String,
  gender: String,
  created_at: Date,
  returned_at: Date,
  shipped_at: Date,
  delivered_at: Date,
  num_of_item: Number
});

module.exports = mongoose.model("Order", OrderSchema);
