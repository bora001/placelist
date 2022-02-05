const mongoose = require("mongoose");

const placeSchema = mongoose.Schema({
  name: {
    type: String,
  },
  location: {
    type: String,
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

const User = mongoose.model("Place", placeSchema);
module.exports = { Place };
