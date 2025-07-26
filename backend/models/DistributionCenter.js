const mongoose = require("mongoose");

const DistributionCenterSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  name: String,
  latitude: Number,
  longitude: Number
});

module.exports = mongoose.model("DistributionCenter", DistributionCenterSchema);
