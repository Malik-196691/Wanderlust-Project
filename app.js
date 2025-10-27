if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ListingRoutes = require("./routes/listing");
const ReviewRoutes = require("./routes/review");
const UserRoutes = require("./routes/user");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

const store = MongoStore.create({
  mongoUrl: process.env.ATLAS_URI || "mongodb://localhost:27017/wanderlust",
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 60 * 60,
});

store.on("error", function (e) { {
  console.log("SESSION STORE ERROR", e);
} });

const sessionConfig = {
  store,
  secret: process.env.SECRET ,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};


const dbUrl = process.env.ATLAS_URI || "mongodb://localhost:27017/wanderlust";

// ✅ Connect to MongoDB
async function main() {
  await mongoose.connect(dbUrl);
  console.log("✅ Connected to MongoDB");
}
main().catch((err) => console.error("MongoDB connection error:", err));

// ✅ EJS setup
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ✅ Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(session(sessionConfig));
app.use(flash());

// ✅ Passport.js setup
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ✅ Flash middleware
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  next();
});

// ✅ Routes
app.use("/listings", ListingRoutes);
app.use("/listings/:id/reviews", ReviewRoutes);
app.use("/", UserRoutes);

// ✅ Home Route
app.get("/", (req, res) => {
  res.redirect("/listings");
});

// ✅ Error Handling Middleware
app.use((err, req, res, next) => {
  const { status = 500, message = "Something went wrong" } = err;
  res.status(status).render("error.ejs", { status, message });
});

// ✅ Start Server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
