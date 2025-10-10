const User = require("../models/user.js");

//callback function for rendering the signup form->
module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup.ejs");
};

//callback function for signup route->
module.exports.signup = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });

    // .register() handles the hashing, salting, and saving.
    const registerUser = await User.register(newUser, password);
    req.login(registerUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to Wanderlust");
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

//callback function for rendering the login form->
module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
};

//callback function for login route->
module.exports.login = async (req, res) => {
  req.flash("success", "Welcome back to Wanderlust! you are logged in");
  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

//callback function for logout route->
module.exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "you are logged out");
    res.redirect("/listings");
  });
};
