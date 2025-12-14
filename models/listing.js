const mongoose = require("mongoose");
const Review = require("./Review");

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url: String,
    filename: String,
  },
  price: Number,
  location: String,

  country: String,
  category: {
    type: String,
    enum: ["Trending", "Rooms", "Cities", "Mountains", "Castles", "Pools", "Camping", "Farms", "Arctic", "Beach", "Forest", "Igloos", "Boat", "Desert", "Skiing", "Dome", "Golf", "Vineyard", "Lake", "Eco-friendly", "Tiny-home", "Luxury", "Historic", "Island", "Mansion", "Treehouse", "Yurt", "Container", "Caravan", "Houseboat", "Towers", "Tropical", "Windy", "Snow", "Desert", "Cave", "Barns"], // Add more if needed
  },
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

listingSchema.post("findOneAndDelete", async function (listing) {
  if (listing) {
    await Review.deleteMany({
      _id: {
        $in: listing.reviews,
      },
    });
  }
});

module.exports = mongoose.model("Listing", listingSchema);

// Other parts of app.js remain unchanged
