// server
require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();
const mongoose = require("mongoose");
const { User } = require("./models/User");
const { Place } = require("./models/Place");
const mbxGeo = require("@mapbox/mapbox-sdk/services/geocoding");
const mbxToken = process.env.mapToken;
const geocoder = mbxGeo({ accessToken: mbxToken });

//---------------------------------------------------------------------------------------//

//mongodb
mongoose
  .connect(process.env.mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("mongoDB is connected..."))
  .catch((err) => console.log(err));

//---------------------------------------------------------------------------------------//

app.use(express.json());
app.use(express.urlencoded());
app.use(express.static(__dirname + "/client"));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", process.env.localUrl + ":5500");
  res.header("Access-Control-Allow-Credentials", true);
  next();
});

app.post("/register", (req, res) => {
  const data = { username: req.body.name, password: req.body.password };
  const newUser = new User(data);

  User.findOne({ username: req.body.name }, function (err, user) {
    if (user) {
      if (err) return res.json({ success: false, err });
      return res
        .status(404)
        .json({ success: false, message: "The name is already exist" });
    } else {
      if (err) return res.json({ success: false, err });
      newUser.save((err, userInfo) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).json({
          success: true,
          message: "Thank you for register!",
        });
      });
    }
  });
});

app.post("/login", (req, res) => {
  const data = { username: req.body.name, password: req.body.password };
  User.findOne({ username: req.body.name }, (err, user) => {
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "We can not find the username",
      });
    }
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.json({
          success: false,
          message: "incorrect Password",
        });
      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);
        return res.status(200).json({
          success: true,
          token: user.token,
          username: user.username,
        });
      });
    });
  });
});

app.post("/create", (req, res) => {
  let data = {
    name: req.body.name,
    price: req.body.price,
    img: req.body.img,
    desc: req.body.desc,
  };

  const geoData = geocoder
    .forwardGeocode({
      query: req.body.location,
      limit: 1,
    })
    .send()
    .then((geo) => {
      data.geometry = geo.body.features[0].geometry;
      const newPlace = new Place(data);
      newPlace.save();
      return res.status(200).json({
        success: true,
      });
    });
});
app.post("/", (req, res) => {
  Place.find((err, data) => {
    return res.json({
      success: true,
      data,
    });
  });
});
// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname + "/index.html"));
// });

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + `/client/pages/${req.path}.html`));
});

app.post("/list", (req, res) => {
  Place.find((err, data) => {
    if ((err) => console.log(err))
      return res.json({
        success: true,
        data,
      });
  });
});
const port = process.env.PORT || 3000;

app.listen(port, (req, res) => {
  console.log("server is connected...");
});
