const express = require("express");
const {
  getCurrentDataControl,
  updateCacheData,
  todayDataControl,
  get7daysDataControl,
} = require("../controllers/weather-data");

const weatherRouter = express.Router();

// Route to fetch weather data for the last 7 days
weatherRouter.get("/last7days", get7daysDataControl);

// Route to fetch today's weather data
weatherRouter.get("/todayData", todayDataControl);

// Route to get the current weather data
weatherRouter.get("/getCurrentData", getCurrentDataControl);

// Route to update the current weather data in cache
weatherRouter.get("/updateCurrentData", updateCacheData);

module.exports = { weatherRouter };
