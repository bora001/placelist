const mongoose = require("mongoose");

const placeSchema = mongoose.Schema({
  name: {
    type: String,
  },
  address: {
    type: String,
  },
  geometry: {
    type: { type: String, enum: ["Point"], required: true },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  price: {
    type: Number,
  },
  desc: {
    type: String,
  },
  img: {
    type: String,
  },
});

const Place = mongoose.model("Place", placeSchema);
module.exports = { Place };
