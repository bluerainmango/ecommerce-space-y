const mongoose = require("mongoose");

const StarshipSchema = new mongoose.Schema({
  id: String,
  title: {
    type: String,
    required: [true, "A planet must have a name."],
    unique: true,
    trim: true,
    maxlength: [
      20,
      "A planet name must have less or equal then 20 characters.",
    ],
    minlength: [3, "A planet name must have more or equal then 3 characters."],
  },
  subtitle: {
    type: String,
    required: [true, "A planet must have a name."],
    trim: true,
    maxlength: [
      40,
      "A planet name must have less or equal then 40 characters.",
    ],
    minlength: [5, "A planet name must have more or equal then 5 characters."],
  },
  category: {
    type: String,
    required: [true, "A planet must have a category."],
    enum: {
      values: ["planets", "starships"],
      message: "category is either: planets or starships.",
    },
  },
  price: {
    type: Number,
    required: [true, "A planet must have a price."],
  },
  description: {
    type: String,
    trim: true,
  },
  descriptionLong: {
    type: String,
    trim: true,
  },
  slug: String,
  benefit: [String],
  image: String,
  featureImage: String,
  collectionThumb: String,
  cockpitImage: String,
  thumbnails: [String],
});

const Starship = mongoose.model("Starship", StarshipSchema);

module.exports = Starship;
