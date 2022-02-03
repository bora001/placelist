const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  username: {
    type: String,
    maxlength: 15,
  },
  password: {
    type: String,
    // minlength: 5,
  },
});

const User = mongoose.model("User", userSchema);
module.exports = { User };
