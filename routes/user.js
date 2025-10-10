const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");

//signup form and signup router->
router.route("/signup")
.get(userController.renderSignupForm)
.post(wrapAsync(userController.signup))


//login page for users and login router->
//passport.authenticate() is a middleware to authenticate whether the user is present or not in the database
router.route("/login")
.get(userController.renderLoginForm)
.post(
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  userController.login
)

//Logout for the user->
router.get("/logout", userController.logout);

module.exports = router;
