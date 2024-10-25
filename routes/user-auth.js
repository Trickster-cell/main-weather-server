const express = require("express");
const {
  userSignupControl,
  userLoginControl,
  userSubsControl,
  getUserControl,
} = require("../controllers/user-auth");
const fetchuser = require("../middleware/fetchuser");

const userRouter = express.Router();

// Route for user signup
userRouter.post("/signup", userSignupControl);

// Route for user login
userRouter.post("/login", userLoginControl);

// Route for subscribing to cities (protected, requires authentication)
userRouter.post("/subscribeCities", fetchuser, userSubsControl);

// Route for fetching user details (protected, requires authentication)
userRouter.get("/details", fetchuser, getUserControl);

module.exports = { userRouter };
