const express = require("express");
const router = express.Router();
const path = require("path");
const { User } = require("../models/User");
const { Place } = require("../models/Place");
const cookieParser = require("cookie-parser");
const { Review } = require("../models/Review");
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
  //need to change
  console.log(req.cookies);
  if (req.cookies.x_auth) {
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
  } else {
    Place.findOne(data, function (err, item) {
      return res.status(200).json({
        success: true,
        item,
      });
    }).populate("review");
  }
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

router.post("/:id/comment", (req, res) => {
  let id = { _id: req.params.id };
  // if (!req.cookies.x_auth) {
  //   return res.status(200).json({
  //     success: false,
  //   });
  // }
  // User.findByToken(req.cookies.x_auth, (err, user) => {
  //   let result = user._id.valueOf() == req.body.userId;
  //   return res.status(200).json({
  //     result,
  //     id,
  //   });
  // });
});

router.post("/:id/comment/delete", (req, res) => {
  let data = { _id: req.body.commentId };

  console.log(req.body);
  Place.findByIdAndUpdate(
    req.body.placeId,
    {
      $inc: {
        rate: -req.body.rate,
      },
      $pull: {
        review: req.body.commentId,
      },
    },
    { new: true },
    function (err, doc) {
      console.log(JSON.stringify(doc));
    }
  );

  Review.findOneAndDelete(data, function (err, item) {
    cloudinary.uploader.destroy(item.imgName);
    return res.status(200).json({
      success: true,
    });
  });
});
module.exports = router;
