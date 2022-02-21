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
  review: {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    username: {
      type: String,
    },

    comment: {
      type: String,
    },
    rate: {
      type: Number,
    },
  },
  rate: {
    type: Number,
  },
  desc: {
    type: String,
  },
  img: {
    type: String,
  },
  writer: {
    type: mongoose.Schema.ObjectId,
  },
});

const Place = mongoose.model("Place", placeSchema);
module.exports = { Place };
