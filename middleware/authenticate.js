const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");

/**
 * Middleware function to authenticate the user using JSON Web Tokens (JWT).
 * It checks whether the user has a valid token stored in cookies and verifies it using the `jsonwebtoken` package.
 * It then finds the user with the matching `_id` and token in the database and attaches the `token`, `rootUser`, and `UserID` properties to the `req` object.
 * If there is any error during this process, it sends a 401 Unauthorized response.
 */

const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.jwtoken;
    if (!token) {
      throw new Error("No token provided");
    }

    const secretKey = process.env.SECRET_KEY;
    if (!secretKey) {
      throw new Error("Secret key not found");
    }

    const verifyToken = jwt.verify(token, secretKey);
    const rootUser = await User.findOne({
      _id: verifyToken._id,
      "tokens.token": token,
    });
    if (!rootUser) {
      throw new Error("User not found");
    }
    req.token = token;
    req.rootUser = rootUser;
    req.UserID = rootUser._id;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      res.status(401).send("Invalid token");
    } else if (error.name === "TokenExpiredError") {
      res.status(401).send("Token expired");
    } else {
      res.status(401).send("Unauthorized: " + error.message);
    }
    console.log(error);
  }
};

module.exports = authenticate;
