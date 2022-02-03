// server

require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();
const mongoose = require("mongoose");

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
// app.use(express.urlencoded());
app.use(express.static(__dirname + "/client"));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", process.env.localUrl + ":5500");
  res.header("Access-Control-Allow-Credentials", true);
  next();
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
