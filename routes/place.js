const express = require("express");
const router = express.Router();
const path = require("path");
const { User } = require("../models/User");
const { Place } = require("../models/Place");
const cookieParser = require("cookie-parser");
const cloudinary = require("cloudinary").v2;

// router.get("/", (req, res) => {
//   // res.sendFile(path.join(__dirname + `/../client/pages/place.html`));
// });
router.use(cookieParser());

router.get("/:id", (req, res) => {
  res.sendFile(path.join(__dirname + `/../client/pages/place.html`));
});

router.post("/:id", (req, res) => {
  let data = { _id: req.params.id };
  User.findByToken(req.cookies.x_auth, (err, user) => {
    Place.findOne(data, function (err, item) {
      let writer = user._id.valueOf() == item.writer.valueOf();
      return res.status(200).json({
        success: true,
        item,
        writer,
      });
    }).populate("review");
  });
});

router.post("/:id/delete", (req, res) => {
  let data = { _id: req.params.id };
  Place.findOneAndDelete(data, function (err, item) {
    cloudinary.uploader.destroy(item.imgName);
    return res.status(200).json({
      success: true,
    });
  });
});

module.exports = router;
