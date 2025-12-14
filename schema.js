const Joi = require("joi");

module.exports.listingSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  location: Joi.string().required(),
  country: Joi.string().required(),
  price: Joi.number().required().min(0),
  image: Joi.string().uri().optional(), // Corrected to allow optional
  category: Joi.string().valid("Trending", "Rooms", "Cities", "Mountains", "Castles", "Pools", "Camping", "Farms", "Arctic", "Beach", "Forest", "Igloos", "Boat", "Desert", "Skiing", "Dome", "Golf", "Vineyard", "Lake", "Eco-friendly", "Tiny-home", "Luxury", "Historic", "Island", "Mansion", "Treehouse", "Yurt", "Container", "Caravan", "Houseboat", "Towers", "Tropical", "Windy", "Snow", "Desert", "Cave", "Barns").allow(""),
}).required();

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    text: Joi.string().required(),
  }).required(),
});
