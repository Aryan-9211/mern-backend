const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

//////////REQUIRE DB CONNECTION AND SCHEMA///////////////
require("../db/conn");
const User = require("../models/userSchema");

/////////////HOME ROUTE////////////////
router.get("/", (req, res) => {
  res.send("HOME PAGE");
});

////////////////REGISTRATION ROUTE////////////////
router.post("/register", async (req, res) => {
  try {
    const { name, email, phone, password, cpassword } = req.body;
    if (!name || !email || !phone || !password || !cpassword) {
      return res.status(422).json({ error: "Please fill the field properly" });
    }

    // Check if a user with the same email already exists
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res
        .status(422)
        .json({ error: "User with this email already exists" });
    }

    const salt = await bcrypt.genSalt();
    const secPass = await bcrypt.hash(password, salt);
    const seccPass = await bcrypt.hash(cpassword, salt);

    // Create a new user if no user with the same email exists
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

//////////////LOGIN ROUTE////////////////
router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Invalid Credentails" });
    }

    const existingUser = await User.findOne({ email: email });

    if (!existingUser) {
      return res.status(400).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid Credentials" });
    }

    res.json({ message: "User signin successfully" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
});


module.exports = router;
