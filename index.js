const express = require("express");
require("dotenv").config();

const cors = require("cors");

const { DBConnection } = require("./db");
const { userRouter } = require("./routes/user-auth");
const { weatherRouter } = require("./routes/weather-data");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", userRouter);
app.use("/weather", weatherRouter);

port = process.env.PORT || 5001;

DBConnection();

app.get("/", (req, res) => {
  res.send("Main Server");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
