const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const userController = require("../controllers/users");


// ✅ Signup route
router.get("/signup", userController.renderSignup);


// ✅ Register route
router.post(
  "/register",
  wrapAsync( userController.register)
);

// ✅ Login routes
router.get("/login", userController.renderLogin);


router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  wrapAsync( userController.login)
);


router.get("/logout", userController.logout);

module.exports = router;
