if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = process.env.ATLAS_URI || "mongodb+srv://Ab-malik123:7Zn5nSyGJAkfzJkq@cluster0.pwqyqxy.mongodb.net/?appName=Cluster0";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data.forEach((Listing) => {
    Listing.owner = "68fdd363a1cefb653469f6e3"; // Replace with a valid user ID from your database
  });
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();