// routes/listings.js
const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn, isOwner } = require("../middleware");
const listingsController = require("../controllers/listings");

const multer = require("multer");
const { cloudinary } = require("../cloudConfig");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Cloudinary Storage Setup
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "listings",
    allowedFormats: ["jpg", "png", "jpeg"], // correct key: allowedFormats
  },
});

const upload = multer({ storage });


// ---------------- ROUTES ----------------

// GET all listings
router.get("/", wrapAsync(listingsController.index));

// Form for new listing
router.get("/new", isLoggedIn, listingsController.renderNewForm);

// Single listing page
router.get("/:id", wrapAsync(listingsController.showListing));

// Edit form
router.get("/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingsController.renderEditForm)
);

// Create new listing
router.post("/",
  isLoggedIn,
  upload.single("image"),
  wrapAsync(listingsController.createListing)
);

// Update listing
router.put("/:id",
  isLoggedIn,
  isOwner,
  upload.single("image"),
  wrapAsync(listingsController.updateListing)
);

// Delete listing
router.delete("/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(listingsController.deleteListing)
);

module.exports = router;
