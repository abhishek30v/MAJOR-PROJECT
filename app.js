if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const env = require("dotenv").config();
//const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const MONGO_URL = process.env.MONGO_URL;
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const expressError = require("./utils/expressError");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

//creating a session->
const sessionOptions = {
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

// middleware for starting a session for a individual user for a period of time to login into the page while going to different pages of same site without being logged out
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
// a web application needs the ability to identify users as they browse from page to page. This series of requests and responses, each associated with the same user, is known as a session.
app.use(passport.session());
// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));
// use static serialize and deserialize of model for passport session support (session ke andr store krna means serialize krna, or user ne session khatam kr dia means deserialize krna)
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

//used listings route because it is common entrance for all the paths of listings
app.use("/listings", listingRouter);
//same for reviews, added the common path entrance
app.use('/listings/:id/reviews', reviewRouter);
//same for users router
app.use('/', userRouter);

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  mongoose.connect(MONGO_URL);
}

app.get("/", (req, res) => {
  //res.send("hi , i am the root");
  res.render("home");
});

/*
app.get("/testListing", async (req,res) => {
    let sampleListing = new Listing({
        title: "My Home Villah",
        description: "By the Beach",
        price : 1200,
        location : "Calangute,Goa",
        country : "India",
    });

    await sampleListing.save();
    console.log("Sample was saved");
    res.send("successful testing");
});
*/

app.all("*", (req, res, next) => {
  next(new expressError(404, "page not found"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "something went wrong" } = err;
  res.status(statusCode).render("error.ejs", { err });
  //res.status(statusCode).send(message);
});

app.listen(8080, () => {
  console.log("server is listening to port 8080");
});
