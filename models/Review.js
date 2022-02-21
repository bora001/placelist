const mongoose = require("mongoose");

const reviewSchema = mongoose.Schema({
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
});

const Review = mongoose.model("Review", reviewSchema);
module.exports = { Review };
