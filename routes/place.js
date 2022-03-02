const express = require("express");
const router = express.Router();
const path = require("path");
const { User } = require("../models/User");
const { Place } = require("../models/Place");
const cookieParser = require("cookie-parser");
const { Review } = require("../models/Review");
const { encode } = require("html-entities");
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
  // if (req.body.userId == req.session.user_id)
  // console.log(req.body, "req.body");
  // console.log(req.session.user_id, "req.session.user_id");

  if (req.session.user_id) {
    User.findById(req.session.user_id, (err, user) => {
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
  if (req.body.userId == req.session.user_id) {
    return res.status(200).json({
      success: true,
      id: req.params.id,
    });
  }
  return res.status(200).json({
    success: false,
  });
  // if (!req.session.user_id) {
  //   return res.status(200).json({
  //     success: false,
  //   });
  // }
  // User.findById(req.session.user_id, (err, user) => {
  //   console.log(user);
  // });
  // User.findByToken(req.session.user_id, (err, user) => {
  //   let result = user._id.valueOf() == req.body.userId;
  //   return res.status(200).json({
  //     result,
  //     id,
  //   });
  // });
});

router.post("/:id/create/comment", (req, res) => {
  console.log(req.params.id, "req.params.id");
  console.log(req.body, "req.body");
  console.log(req.session.user_id, "session");
  let data = {
    userId: "",
    username: "",
    placeId: req.params.id,
    rate: req.body.rate,
    comment: encode(req.body.comment),
  };
  if (req.session.user_id) {
    User.findById(req.session.user_id, (err, user) => {
      console.log(user, "user");
      data.userId = user._id;
      data.username = user.username;
      const newReview = new Review(data);
      const reviewId = newReview._id;
      console.log(newReview, "newReview");
      console.log(reviewId, "reviewId");
      newReview.save();
      Place.findOneAndUpdate(
        { _id: req.body.id },
        {
          $inc: {
            rate: req.body.rate,
          },
          $push: {
            review: reviewId,
          },
        },
        function (err, update) {
          if (err) return res.status(200).json({ success: false, err });
          return res.status(200).send({ success: true, update });
        }
      );
    });
  }
});

router.post("/:id/comment/delete", (req, res) => {
  let data = { _id: req.body.commentId };
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
