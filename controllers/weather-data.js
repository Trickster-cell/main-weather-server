require("dotenv").config();
const { redis } = require("../utils/redis");
const { pool } = require("../db");
const { getWeatherData, convertTemperature } = require("../utils/getWeatherData");

const cities = [
  "Delhi",
  "Mumbai",
  "Chennai",
  "Bangalore",
  "Kolkata",
  "Hyderabad",
];

const getCityData = async (city) => {
  const data = await getWeatherData(city);
  const temperature = convertTemperature(data.main.temp);
  const feelsLike = convertTemperature(data.main.feels_like);
  const condition = data.weather[0].main;
  const timestamp = data.dt;
  const humidity = data.main.humidity; // New field
  const windSpeed = data.wind.speed; // New field
  const cacheKey = `weather:${city}`;
  const cacheValue = JSON.stringify({
    temperature,
    feelsLike,
    condition,
    timestamp,
    humidity,
    windSpeed,
  });

  return { cacheKey, cacheValue };
};

const getCurrentDataControl = async (req, res) => {
  try {
    const finalData = {};
    for (const city of cities) {
      const cacheKey = `weather:${city}`;
      const cityCache = await redis.get(cacheKey);

      if (cityCache) {
        // If cache exists, parse and add it to finalData
        finalData[city] = JSON.parse(cityCache);
      } else {
        // Fetch weather data, cache it, and add it to finalData
        const data = await getCityData(city);
        await redis.set(data.cacheKey, data.cacheValue, "EX", 3600); // Add expiration time
        finalData[city] = JSON.parse(data.cacheValue); // Ensure parsed value is stored
      }
    }
    // Return the final data as JSON
    res.status(200).json(finalData);
  } catch (error) {
    console.error("Failed to fetch data:", error);
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
};

const updateCacheData = async (req, res) => {
  try {
    const finalData = {};
    for (const city of cities) {
      // Set the cache value with an expiration time (e.g., 1 hour)
      const data = await getCityData(city);
      await redis.set(data.cacheKey, data.cacheValue, "EX", 3600);
      finalData[city] = JSON.parse(data.cacheValue); // Ensure parsed value is stored
    }
    res.status(200).json(finalData);
  } catch (error) {
    console.error("Failed to fetch and store weather data:", error);
  }
};

const todayDataControl = async (req, res) => {
  try {
    const finalData = {};

    // Use Promise.all to handle multiple asynchronous queries
    const promises = cities.map(async (city) => {
      const result = await pool.query(
        `SELECT * FROM weather_data WHERE city = $1`,
        [city]
      );
      finalData[city] = result.rows; // Store the result in finalData
    });

    // Wait for all promises to resolve
    await Promise.all(promises);

    // Send the response with the final data
    res.status(200).json(finalData);
  } catch (error) {
    console.error("Failed to fetch and store weather data:", error);
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
};

const get7daysDataControl = async (req, res) => {
  try {
    finalData = {};
    const promises = cities.map(async (city) => {
      const cacheKey = `last7:${city}`;
      const cachedData = await redis.get(cacheKey);
      if (cachedData) {
        finalData[city] = JSON.parse(cachedData);
      } else {
        const result = await pool.query(
          `SELECT * 
             FROM daily_summaries 
             WHERE city = $1 
             AND date < CURRENT_DATE
             ORDER BY date DESC`,
          [city]
        );
        finalData[city] = result.rows;
        await redis.set(cacheKey, JSON.stringify(finalData[city]), "EX", 1 * 3600);
      }
    });
    await Promise.all(promises);

    // Send the response with the final data
    res.status(200).json(finalData);
  } catch (error) {
    console.error("Failed to fetch and store weather data:", error);
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
};

module.exports = {
  getCurrentDataControl,
  updateCacheData,
  todayDataControl,
  get7daysDataControl,
};
