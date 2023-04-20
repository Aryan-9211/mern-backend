const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authenticate = require("../middleware/authenticate"); // make sure to define this middleware
const cookieParser = require("cookie-parser");
router.use(cookieParser());

// Require database connection and user schema
require("../db/conn"); // replace with appropriate path to your database connection file
const User = require("../models/userSchema"); // replace with appropriate path to your user schema file

// Registration route
router.post("/register", async (req, res) => {
  try {
    const { name, email, phone, password, cpassword } = req.body;
    if (!name || !email || !phone || !password || !cpassword) {
      return res
        .status(422)
        .json({ error: "Please fill all the fields properly" });
    }

    if (password !== cpassword) {
      return res.status(422).json({ error: "Passwords do not match" });
    }

    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res
        .status(422)
        .json({ error: "User with this email already exists" });
    }

    const salt = await bcrypt.genSalt();
    const secPass = await bcrypt.hash(password, salt);
    const seccPass = await bcrypt.hash(cpassword, salt);

    const user = new User({
      name,
      email,
      phone,
      password: secPass,
      cpassword: seccPass,
    });

    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Login route
router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }
    if (!password) {
      return res.status(400).json({ error: "Password is required" });
    }

    const existingUser = await User.findOne({ email: email });
    if (!existingUser) {
      return res.status(400).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid Credentials" });
    }

    const token = await existingUser.generateAuthToken();
    console.log(token);
    res.cookie("jwtoken", token, {
      expires: new Date(Date.now() + 25892000000),
      httpOnly: true,
    });

    res.json({ message: "User signin successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

////////////////ABOUT US PAGE//////////////////
router.get("/about", authenticate, (req, res) => {
  res.send(req.rootUser);
});

////////////////LOGOUT ROUTE//////////////////
router.get("/logout", (req, res) => {
  console.log("logout calles");
  res.clearCookie("jwtoken", { path: "/" });
  res.status(200).send("User Logout");
});

module.exports = router;
