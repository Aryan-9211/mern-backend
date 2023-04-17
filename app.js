const express = require("express");
const dotenv = require("dotenv");
const app = express();
const bodyParser = require("body-parser");

dotenv.config({ path: "./config.env" });
require("./db/conn");
const PORT = process.env.PORT;

//BODY PARSER
// Parse incoming requests with JSON payloads
app.use(bodyParser.json());
// Parse incoming requests with URL-encoded payloads
app.use(bodyParser.urlencoded({ extended: true }));

//ROUTER
app.use(require("./router/auth"));

//MIDDLEWARE
const middleware = (req, res, next) => {
  console.log("middleware");
  next();
};

app.get("/", (req, res) => {
  res.send("Home page");
});

app.get("/about", middleware, (req, res) => {
  res.send("About Page");
});

app.get("/signin", (req, res) => {
  res.send("Signin Page");
});

app.get("/signout", (req, res) => {
  res.send("signout page");
});

app.listen(PORT, () => {
  console.log("app running");
});
