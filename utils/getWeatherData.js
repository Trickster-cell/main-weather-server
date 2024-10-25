const axios = require('axios');
require('dotenv').config();

const apiKey = process.env.OPEN_WEATHER_API_KEY; // OpenWeather API key from environment variables

// Function to fetch weather data for a given city
const getWeatherData = async (city) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const response = await axios.get(url); // Make a GET request to the weather API
    return response.data; // Return the weather data
};

// Function to convert temperature from Kelvin to Celsius
const convertTemperature = (kelvin) => {
    return kelvin - 273.15; // Convert Kelvin to Celsius
};

module.exports = { getWeatherData, convertTemperature };
