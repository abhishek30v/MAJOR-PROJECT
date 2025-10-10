const Listing = require("./models/listing");
const Review = require("./models/review.js");
const expressError = require("./utils/expressError");
const { listingSchema, reviewSchema } = require("./schema.js");

//middleware function for the user login and authentication
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    //redirect URL
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "you must be logged in to create listing!");
    return res.redirect("/login");
  }
  next();
};

//middleware function for saving the redirect page urls
module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

//Middleware function for owner of the listing for authorization
module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (
    res.locals.currUser &&
    !listing.owner._id.equals(res.locals.currUser._id)
  ) {
    req.flash("error", "you are not the owner of this listing");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

//Middleware function for author/writer of the review for authorization like who made the review can only delete that one.
module.exports.isReviewAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if (res.locals.currUser && !review.author.equals(res.locals.currUser._id)) {
    req.flash("error", "you are not the author of this review");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

//Middleware function for joi schema validation of listings
module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((ele) => ele.message).join(",");
    throw new expressError(400, errMsg);
  } else {
    next();
  }
};

//Joi validation of reviews
module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((ele) => ele.message).join(",");
    throw new expressError(400, errMsg);
  } else {
    next();
  }
};
