const mongoose = require("mongoose");

// Define the user schema
const schema = new mongoose.Schema({
  name: { type: String, required: true }, // User's name
  email: { type: String, required: true, unique: true }, // User's email (must be unique)
  password: { type: String, required: true }, // User's password
  subscribedCitys: { type: [String], default: [] }, // List of cities user is subscribed to
  date: { type: Date, default: Date.now }, // Account creation date
  minTemp: { type: Number, default: 0 }, // Minimum temperature preference
  maxTemp: { type: Number, default: 45 }, // Maximum temperature preference
  minHumidity: { type: Number, default: 20 }, // Minimum humidity preference
  maxHumidity: { type: Number, default: 95 }, // Maximum humidity preference
  minWindSpeed: { type: Number, default: 0 }, // Minimum wind speed preference
  maxWindSpeed: { type: Number, default: 25 }, // Maximum wind speed preference
});

// Export the user model
module.exports = mongoose.model("users", schema);
