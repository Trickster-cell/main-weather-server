const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  subscribedCitys: { type: [String], default: [] },
  date: { type: Date, default: Date.now },
  minTemp: { type: Number, default: 0 },
  maxTemp: { type: Number, default: 45 },
  minHumidity: { type: Number, default: 20 },
  maxHumidity: { type: Number, default: 95 },
  minWindSpeed: { type: Number, default: 0 },
  maxWindSpeed: { type: Number, default: 25 },
});

module.exports = mongoose.model("users", schema);
