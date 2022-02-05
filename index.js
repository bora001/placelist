// server
require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();
const mongoose = require("mongoose");
const { User } = require("./models/User");

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
  // console.log(data);
  const newUser = new User(data);

  User.findOne({ username: req.body.name }, function (err, user) {
    if (user) {
      if (err) return res.json({ success: false, err });

      return res
        .status(404)
        .json({ success: false, message: "The name is already exist" });
    } else {
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

// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname + "/index.html"));
// });

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + `/client/pages/${req.path}.html`));
});

const port = process.env.PORT || 3000;

app.listen(port, (req, res) => {
  console.log("server is connected...");
});
