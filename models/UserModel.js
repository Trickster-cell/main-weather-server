const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  subscribedCitys: {type: [String], default:[]},
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("users", schema);