const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn, isReviewAuthor } = require("../middleware");
const reviewControllers = require("../controllers/reviews");


// ✅ POST — Add review to listing
router.post(
  "/",
  isLoggedIn,
  wrapAsync(reviewControllers.createReview)
);


// ✅ DELETE — Remove review
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor, // ✅ uncomment for security
  wrapAsync( reviewControllers.deleteReview)
);

module.exports = router;
