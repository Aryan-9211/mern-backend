const express = require("express");
const dotenv = require("dotenv");
const app = express();
const bodyParser = require("body-parser");

dotenv.config({ path: "./config.env" });
require("./db/conn");
const PORT = process.env.PORT || 5000;

//BODY PARSER
// Parse incoming requests with JSON payloads
app.use(bodyParser.json());
// Parse incoming requests with URL-encoded payloads
app.use(bodyParser.urlencoded({ extended: true }));

//ROUTER
app.use(require("./router/auth"));

app.listen(PORT, () => {
  console.log(`app running on port ${PORT}`);
});
