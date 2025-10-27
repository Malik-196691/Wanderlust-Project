const { reviewSchema } = require("../schema");
const Listing = require("../models/listing");
const Review = require("../models/Review");
const ExpressError = require("../utils/ExpressError");


module.exports.createReview=async (req, res) => {
    const { id } = req.params;

    const { error } = reviewSchema.validate(req.body);
    if (error) {
      const msg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(msg, 400);
    }

    const listing = await Listing.findById(id);
    if (!listing) throw new ExpressError("Listing not found", 404);

    const review = new Review(req.body.review);
    review.author = req.user._id;
    listing.reviews.push(review);
    await review.save();
    await listing.save();

    req.flash("success", "Successfully added a new review!");
    res.redirect(`/listings/${listing._id}`);
  };
  


module.exports.deleteReview=async (req, res) => {
    const { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "Review deleted successfully.");
    res.redirect(`/listings/${id}`);
  };