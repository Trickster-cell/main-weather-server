const Pool = require("pg").Pool;
const mongoose = require('mongoose');

require("dotenv").config();

//PostGreSQL
const pool = new Pool({
  connectionString: process.env.DB_CONNECTION_STRING,
  ssl: {
    rejectUnauthorized: false,
  },
});

const DBConnection = async () => {
  const MONGO_URI = process.env.MONGODB_URI;

  try {
    await mongoose.connect(MONGO_URI);
    console.log("MONGO DB Connected Successfully!!");
  } catch (err) {
    console.log("Error Connecting Database", err.message);
  }
};

module.exports = { pool, DBConnection };
