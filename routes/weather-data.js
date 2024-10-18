const express = require("express");
const { getCurrentDataControl, updateCacheData, todayDataControl, get7daysDataControl } = require("../controllers/weather-data");

const weatherRouter = express.Router();

weatherRouter.get("/last7days", get7daysDataControl);

weatherRouter.get("/todayData", todayDataControl);

weatherRouter.get("/getCurrentData", getCurrentDataControl);

weatherRouter.get("/updateCurrentData", updateCacheData);

module.exports = { weatherRouter };
