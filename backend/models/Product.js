const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  cost: Number,
  category: String,
  name: String,
  brand: String,
  retail_price: Number,
  department: String,
  sku: String,
  distribution_center_id: Number
});

module.exports = mongoose.model("Product", ProductSchema);
