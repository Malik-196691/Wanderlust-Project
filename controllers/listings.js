const Listing = require("../models/listing");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema");

module.exports.index = async (req, res) => {
  const listings = await Listing.find({});
  res.render("listings/index.ejs", { listings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("./listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res) => {
  if (!req.file) {
    throw new ExpressError("Please upload an image", 400);
  }
  let url = req.file.path;
  let filename = req.file.filename;
  const result = listingSchema.validate(req.body);
  if (result.error) {
    const msg = result.error.details.map((el) => el.message).join(",");
    console.log(result.error);
    throw new ExpressError(msg, 400);
  }
  const { title, description, price, location, country } = req.body;
  const newListing = new Listing({
    title,
    description,
    price,
    location,
    country,
  });
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  await newListing.save();
  req.flash("success", "Successfully created a new listing!");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    throw new ExpressError("Listing not found", 404);
  }
  let originalImageUrl = listing.image.url;
  originalImageUrl.replace("/upload", "/upload/w_250"); // Resize for display
  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
  let url, filename;
  if (req.file) {
    url = req.file.path;
    filename = req.file.filename;
  }
  const { id } = req.params;
  const { title, description, price, location, country } = req.body;
  await Listing.findByIdAndUpdate(id, {
    title,
    description,
    image: url ? { url, filename } : undefined,
    price,
    location,
    country,
  });
  req.flash("success", "Successfully updated the listing!");
  res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted the listing!");
  res.redirect("/listings");
};
