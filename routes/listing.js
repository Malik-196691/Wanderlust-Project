const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn, isOwner } = require("../middleware");
const listingsController = require("../controllers/listings");
const multer = require("multer");
const storage = multer.diskStorage({});
const { cloudinary } = require("../cloudConfig");
const upload = multer({ storage });


// ✅ GET all listings
router.get(
  "/",
  wrapAsync(listingsController.index)
);


// ✅ Render new listing form
router.get("/new", isLoggedIn, listingsController.renderNewForm); 


// ✅ GET single listing with reviews
router.get(
  "/:id",
  wrapAsync( listingsController.showListing)
);


// ✅ Render edit form
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync( listingsController.renderEditForm)
);


// ✅ Create new listing
router.post(
  "/",
  isLoggedIn,
  upload.single("image"),
  wrapAsync( listingsController.createListing)
);


// ✅ Update listing
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  upload.single("image"),
  wrapAsync( listingsController.updateListing)
);


// ✅ Delete listing
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync( listingsController.deleteListing)
);

module.exports = router;
