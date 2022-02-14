const express = require("express");
const router = express.Router();
const path = require("path");
const { Place } = require("../models/Place");

// router.get("/", (req, res) => {
//   // res.sendFile(path.join(__dirname + `/../client/pages/place.html`));
// });

router.get("/:id", (req, res) => {
  res.sendFile(path.join(__dirname + `/../client/pages/place.html`));
});

router.post("/:id", (req, res) => {
  let data = { _id: req.params.id };
  Place.findOne(data, function (err, item) {
    return res.status(200).json({
      success: true,
      item,
    });
  });
});

module.exports = router;
