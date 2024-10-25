const Redis = require("ioredis");
require('dotenv').config();

// Create a Redis client and connect to the Redis server using environment variables
const redis = new Redis({
  host: process.env.REDIS_HOST, // Redis server host
  port: process.env.REDIS_PORT, // Redis server port
  password: process.env.REDIS_PASSWORD, // Redis password (if required)
  // Additional options can be added here as needed
});

// Log successful connection to Redis
redis.on('connect', () => {
  console.log('Connected to Redis successfully!');
});

// Log any connection errors
redis.on('error', (err) => {
  console.error('Error connecting to Redis:', err);
});

module.exports = { redis };
