const Listing = require("../models/listing");
const maptilerClient = require("@maptiler/client");
maptilerClient.config.apiKey = process.env.MAPTILER_KEY;

//callback for the index route->
module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

//callback for the new listing form route->
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

//callback for the showing all the listings->
module.exports.showListings = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings");
  }
  res.render("listings/show.ejs", {
    listing,
    mapToken: process.env.MAPTILER_KEY,
  });
};

//callback for creating the new listings->
module.exports.createListing = async (req, res, next) => {
  /*if (!req.body.listing) {
    throw new expressError(400, "send a valid data for listing"); //400 is the error for the bad request of client side
  }*/

  //let {title,description,image,price,country,location} = req.body;

  let response = await maptilerClient.geocoding.forward(
    req.body.listing.location,
    { limit: 1 }
  );

  let url = req.file.path;
  let filename = req.file.filename;
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };

  //Save the geocoded coordinates to the new listing
  newListing.geometry = response.features[0].geometry;

  let savedListing = await newListing.save();
  //console.log(savedListing);
  req.flash("success", "new Listing Created!");
  res.redirect("/listings");
};

//callback for the edit listing form->
module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested for edit does not exist!");
    res.redirect("/listings");
  }

  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

//callback for updating the listings->
module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }
  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

//callback for deleting the listings->
module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted!");
  //console.log(deletedListing);
  res.redirect("/listings");
};
