const Listing = require("../models/listing");
const ExpressError = require("../utils/expressError");
const { listingSchema } = require("../schema");
const { cloudinary } = require("../cloudConfig");

// ----------------------------------
// GET all listings
// ----------------------------------
module.exports.index = async (req, res) => {
  const listings = await Listing.find({});
  res.render("listings/index.ejs", { listings });
};

// ----------------------------------
// Render new form
// ----------------------------------
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

// ----------------------------------
// Show listing
// ----------------------------------
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

// ----------------------------------
// Create listing WITH Cloudinary
// ----------------------------------
module.exports.createListing = async (req, res) => {
  console.log(req.file);
  console.log(req.body);

  if (!req.file) throw new ExpressError("Please upload an image", 400);

  const { error } = listingSchema.validate(req.body);
  if (error) {
    throw new ExpressError(error.details.map((e) => e.message).join(","), 400);
  }

  const newListing = new Listing(req.body);
  newListing.owner = req.user._id;

  // Cloudinary file
  newListing.image = {
    url: req.file.path,
    filename: req.file.filename,
  };

  await newListing.save();
  req.flash("success", "Successfully created a new listing!");
  res.redirect("/listings");
};

// ----------------------------------
// Render edit form
// ----------------------------------
module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findById(id);
  if (!listing) throw new ExpressError("Listing not found", 404);

  // Proper resized Cloudinary URL
  const originalImageUrl = listing.image.url.replace(
    "/upload",
    "/upload/w_250"
  );

  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

// ----------------------------------
// Update listing + Keep old image unless uploading new
// ----------------------------------
module.exports.updateListing = async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  // Apply normal updates
  listing.title = req.body.title;
  listing.description = req.body.description;
  listing.price = req.body.price;
  listing.location = req.body.location;
  listing.country = req.body.country;

  // If new image uploaded
  if (req.file) {
    // Delete old image from Cloudinary
    await cloudinary.uploader.destroy(listing.image.filename);

    // Save new image
    listing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
  }

  await listing.save();
  req.flash("success", "Successfully updated the listing!");
  res.redirect(`/listings/${id}`);
};

// ----------------------------------
// Delete listing + Cloudinary image
// ----------------------------------
module.exports.deleteListing = async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findById(id);

  if (listing && listing.image && listing.image.filename) {
    await cloudinary.uploader.destroy(listing.image.filename);
  }

  await Listing.findByIdAndDelete(id);

  req.flash("success", "Successfully deleted the listing!");
  res.redirect("/listings");
};
