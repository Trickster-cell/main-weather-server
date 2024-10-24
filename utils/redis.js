const Redis = require("ioredis");
require('dotenv').config();
// Create a Redis client and connect to the remote Redis server
const redis = new Redis({
  host: process.env.REDIS_HOST, // Replace with your Redis host
  port: process.env.REDIS_PORT, // Replace with your Redis port
  password: process.env.REDIS_PASSWORD, // Replace with your Redis password (if required)
  // Add any other necessary options here
});

redis.on('connect', () => {
  console.log('Connected to Redis successfully!');
});

// Event listener for connection errors
redis.on('error', (err) => {
  console.error('Error connecting to Redis:', err);
});

module.exports = { redis };
