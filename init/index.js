const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

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
    Listing.owner = "68f5db29b60bcc5075d6b203"; // Replace with a valid user ID from your database
  });
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();