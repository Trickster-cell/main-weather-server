require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const UserModel = require("../models/UserModel");
const { pool } = require("../db");

const userSignupControl = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const checkUser = await UserModel.findOne({ email: email });
    if (checkUser) {
      console.log("User already exists!!");
      return res.status(409).json({
        // Conflict status code for existing user
        message: `User with email ${email} already exists!`,
        success: "false",
        status: 409,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserModel({
      name: name,
      email: email,
      password: hashedPassword,
    });

    await newUser.save();

    console.log("User registered successfully!!");

    return res.status(201).json({
      // Created status code for successful registration
      message: "User Registered Successfully!!",
      success: "true",
      status: 201,
    });
  } catch (error) {
    console.log("Error: ", error.message);
    return res.status(500).json({
      // Server error
      message: "Some error occurred, please try again!",
      success: "false",
      status: 500,
    });
  }
};

const userLoginControl = async (req, res) => {
  const { userEmail, userPassword } = req.body;

  try {
    const user = await UserModel.findOne({ email: userEmail }); // Fixed to search by 'email'

    if (!user) {
      console.log(`User doesn't exist!`);
      return res.status(404).json({
        // Not Found status code for non-existing user
        message: `User with email id ${userEmail} does not exist!`,
        success: "false",
        status: 404,
      });
    }

    const passwordValid = await bcrypt.compare(userPassword, user?.password);

    if (!passwordValid) {
      console.log("Password doesn't match!");
      return res.status(401).json({
        // Unauthorized status code for invalid credentials
        message: "Invalid Credentials",
        success: "false",
        status: 401,
      });
    }

    const token = jwt.sign({ id: user?._id }, process.env.JWT_SECRET, {
      expiresIn: "3h",
    });

    console.log("User Logged In Successfully!!");
    return res.status(200).json({
      // OK status code for successful login
      token,
      userID: user?._id,
      message: "User Logged In Successfully!!",
      success: "true",
      status: 200,
    });
  } catch (error) {
    console.log("Error: ", error.message);
    return res.status(500).json({
      // Server error
      message: "Some error occurred, please try again!",
      success: "false",
      status: 500,
    });
  }
};

const updateUserSubscriptionControl = async (email, cities) => {
  // Check if the required fields are provided
  if (!email || !Array.isArray(cities)) {
    throw new Error("Email and an array of cities are required.");
  }

  try {
    // Prepare an array of promises for inserting/updating subscriptions
    const promises = cities.map((city) => {
      return pool.query(
        "INSERT INTO user_subscriptions (email, city) VALUES ($1, $2) ON CONFLICT (email, city) DO NOTHING",
        [email, city]
      );
    });

    // Execute all promises concurrently
    await Promise.all(promises);
  } catch (error) {
    console.error("Error: ", error.message);
    throw new Error("Error updating user subscriptions.");
  }
};

const userSubsControl = async (req, res) => {
  const { userId } = req;
  const {
    arrayOfCities,
    minTemp,
    maxTemp,
    minHumidity,
    maxHumidity,
    minWindSpeed,
    maxWindSpeed,
  } = req.body; // Assuming you're sending data in the request body

  try {
    // Fetch the user by ID
    const user = await UserModel.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
        success: false,
        status: 404,
      });
    }

    // Update the subscribedCitys field
    user.subscribedCitys = arrayOfCities;
    user.minTemp = minTemp;
    user.maxTemp = maxTemp;
    user.minHumidity = minHumidity;
    user.maxHumidity = maxHumidity;
    user.minWindSpeed = minWindSpeed;
    user.maxWindSpeed = maxWindSpeed;

    // Save the updated user
    await user.save();

    // Call the subscription update control function
    await updateUserSubscriptionControl(user.email, user.subscribedCitys);

    await pool.query("DELETE FROM alert_thresholds WHERE user_email = $1", [
      user.email,
    ]);

    const promises = arrayOfCities.map((city) => {
      return pool.query(
        "INSERT INTO alert_thresholds (user_email, city, min_temp,max_temp,min_humidity,max_humidity,min_wind_speed,max_wind_speed) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) ON CONFLICT (user_email, city) DO NOTHING",
        [
          user.email,
          city,
          minTemp,
          maxTemp,
          minHumidity,
          maxHumidity,
          minWindSpeed,
          maxWindSpeed,
        ]
      );
    });

    await Promise.all(promises);

    return res.status(200).json({
      message: "Subscription successful!",
      success: true,
      status: 200,
    });
  } catch (error) {
    console.log("Error: ", error.message);
    return res.status(500).json({
      message: "Some error occurred, please try again!",
      success: false,
      status: 500,
    });
  }
};

const getUserControl = async (req, res) => {
  const { userId } = req; // Assuming userId is added to req by a middleware

  try {
    const user = await UserModel.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        // Use 404 for not found
        message: "User not found",
      });
    }

    return res.status(200).json({
      // Use 200 for successful retrieval
      user, // Send the user object in the response
    });
  } catch (error) {
    console.log("Error: ", error.message);
    return res.status(500).json({
      // Improved error handling
      message: "Some error occurred",
      error: error.message, // Optional: include the error message for debugging
    });
  }
};

module.exports = {
  userLoginControl,
  userSignupControl,
  userSubsControl,
  getUserControl,
};
