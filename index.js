const express = require("express");
require("dotenv").config();
const cors = require("cors");

const { DBConnection } = require("./db");
const { userRouter } = require("./routes/user-auth");
const { weatherRouter } = require("./routes/weather-data");

const app = express();

// Middleware setup
app.use(cors());
app.use(express.json());

// Route setup
app.use("/auth", userRouter);      // User authentication routes
app.use("/weather", weatherRouter); // Weather data routes

const port = process.env.PORT || 5001;

// Initialize database connection
DBConnection();

app.get("/", (req, res) => {
  res.send("Main Server");
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
