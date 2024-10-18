const express = require("express");
const {
  userSignupControl,
  userLoginControl,
  userSubsControl,
  getUserControl,
} = require("../controllers/user-auth");
const fetchuser = require("../middleware/fetchuser");

const userRouter = express.Router();

userRouter.post("/signup", userSignupControl);
userRouter.post("/login", userLoginControl);
userRouter.post("/subscribeCities", fetchuser, userSubsControl);
userRouter.get("/details", fetchuser, getUserControl);

module.exports = { userRouter };
