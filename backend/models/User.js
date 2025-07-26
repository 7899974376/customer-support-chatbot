// const mongoose = require("mongoose");

// const UserSchema = new mongoose.Schema({
//   id: { type: Number, unique: true },
//   first_name: String,
//   last_name: String,
//   email: String,
//   age: Number,
//   gender: String,
//   state: String,
//   street_address: String,
//   postal_code: String,
//   city: String,
//   country: String,
//   latitude: Number,
//   longitude: Number,
//   traffic_source: String,
//   created_at: Date
// });

// module.exports = mongoose.model("users", UserSchema);

const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  first_name: String,
  last_name: String,
  email: String,
  age: Number,
  gender: String,
  state: String,
  street_address: String,
  postal_code: String,
  city: String,
  country: String,
  latitude: Number,
  longitude: Number,
  traffic_source: String,
  created_at: Date
});

module.exports = mongoose.model("User", UserSchema);
