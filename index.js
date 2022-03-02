// server
require("dotenv").config();
const express = require("express");
const session = require("express-session");
const path = require("path");
const placeRouter = require("./routes/place");
const app = express();
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const { User } = require("./models/User");
const { Place } = require("./models/Place");
const { Review } = require("./models/Review");
const cookieParser = require("cookie-parser");
const mbxGeo = require("@mapbox/mapbox-sdk/services/geocoding");
const mbxToken = process.env.mapToken;
const geocoder = mbxGeo({ accessToken: mbxToken });
const { encode } = require("html-entities");

// multer
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

//cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "placelist-img",
    allowedFormats: ["jpeg", "jpg", "png"],
  },
});
const upload = multer({ storage });

//passport
const passport = require("passport");
const localPassport = require("passport-local");
const { Console } = require("console");

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
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/client"));
app.use(cookieParser());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", process.env.localUrl + ":5500");
  res.header("Access-Control-Allow-Credentials", true);
  next();
});

app.use(
  require("express-session")({
    secret: "typethesecret",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new localPassport(User.authenticate()));

//---------------------------------------------------------------------------------------//

app.post("/auth", (req, res) => {
  if (!req.session.user_id) {
    return res.json({ login: false });
  }
  return res.json({ login: true });

  // if (!req.isAuthenticated()) {
  //   return res.json({ login: false });
  // }
  // return res.json({ login: true });
});

app.post("/logout", (req, res) => {
  // req.session.user_id = null;
  // return res.json({ login: false });
  // return res.redirect("/");
});
app.post("/register", async (req, res) => {
  const { username, password, passwordConfirm } = req.body;
  console.log(username, password, passwordConfirm);
  if (password == passwordConfirm) {
    const userCheck = await User.findOne({ username });
    if (userCheck) {
      console.log("The name is already exist");
    } else {
      const user = new User({ username, password: hash });
      await user.save();
      return res.redirect("/");
    }
  } else {
    console.log("wrong password");
  }

  res.send(password == passwordConfirm);
});
// app.post("/register", (req, res) => {
//   const data = { username: req.body.name, password: req.body.password };

//   const newUser = new User(data);

//   User.findOne({ username: req.body.name }, function (err, user) {
//     if (user) {
//       if (err) return res.json({ success: false, err });
//       return res
//         .status(404)
//         .json({ success: false, message: "The name is already exist" });
//     } else {
//       if (err) return res.json({ success: false, err });
//       newUser.save((err, userInfo) => {
//         if (err) return res.json({ success: false, err });
//         return res.status(200).json({
//           success: true,
//           message: "Thank you for register!",
//         });
//       });
//     }
//   });
// });

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  console.log(username, password, "😊😊😊😊");
  const user = await User.findOne({ username });
  const validPw = await bcrypt.compare(password, user.password);
  if (validPw) {
    req.session.user_id = user._id;
    // res.send("login success");
    res.redirect("/");
  } else {
    res.redirect("/login");
  }
});

// app.post("/login", (req, res) => {
//   const data = { username: req.body.name, password: req.body.password };
//   User.findOne({ username: req.body.name }, (err, user) => {
//     if (!user) {
//       return res.json({
//         loginSuccess: false,
//         message: "We can not find the username",
//       });
//     }
//     user.comparePassword(req.body.password, (err, isMatch) => {
//       if (!isMatch)
//         return res.json({
//           success: false,
//           message: "incorrect Password",
//         });
//       user.generateToken((err, user) => {
//         if (err) return res.status(400).send(err);
//         req.session.user_id = user.id;
//         // res.cookie("x_auth", user.token);
//         // res.cookie("x_auth", user.token, {
//         //   expires: new Date(Date.now() + 900000),
//         //   httpOnly: true,
//         // });
//         return res.status(200).json({
//           login: true,
//           success: true,
//           token: user.token,
//           username: user.username,
//         });
//       });
//     });
//   });
// });

app.post("/create", upload.single("img"), (req, res) => {
  let data = {
    name: encode(req.body.name),
    rate: req.body.rate,
    address: encode(req.body.location),
    img: req.file.path,
    imgName: req.file.filename,
    writer: "",
  };

  User.findByToken(req.cookies.x_auth, (err, user) => {
    data.writer = user._id;
  });
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

//multer

app.post("/test", (req, res) => {
  console.log("test", req.body);
});

app.post("/review", (req, res) => {
  let data = {
    userId: "",
    username: "",
    placeId: req.body.id,
    rate: req.body.rate,
    comment: encode(req.body.comment),
  };
  let token = req.body.user;

  User.findByToken(token, (err, user) => {
    data.userId = user._id;
    data.username = user.username;
    const newReview = new Review(data);
    const reviewId = newReview._id;
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

//router
app.use("/place", placeRouter);

app.get("/secret", (req, res) => {
  if (!req.session.user_id) {
    return res.send("hey you didn't login");
  }
  res.send("hoho");
});

app.get("*", (req, res) => {
  const link = req.path.split("/");
  if (link.length < 3) {
    res.sendFile(path.join(__dirname + `/client/pages/${req.path}.html`));
  }
  // res.sendFile(path.join(__dirname + `/client/pages/${req.path}.html`));
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
