const listingModel = require("./models/listing");
const reviewModel = require("./models/Review");


module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You must be logged in to perform that action.");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.returnTo) {
    res.locals.returnTo = req.session.returnTo;
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  const { id } = req.params;
  const listing = await listingModel.findById(id);
  if (!listing) {
    req.flash("error", "Listing not found.");
    return res.redirect("/listings");
  }
  if (listing.owner.toString() !== req.user._id.toString()) {
    req.flash("error", "You do not have permission to do that.");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
  const { reviewId } = req.params;
  const review = await reviewModel.findById(reviewId);
  if (!review) {
    req.flash("error", "Review not found.");
    return res.redirect("/listings");
  }
  if (review.author.toString() !== req.user._id.toString()) {
    req.flash("error", "You do not have permission to do that.");
    return res.redirect("back");
  } 
  next();
};
