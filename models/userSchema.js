const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  cpassword: {
    type: String,
    required: true,
  },
});

// //////////HASHING THE PASSWORD////////////
// userSchema.pre("save", async function (next) {
//   if (this.isModified("password")) {
//     this.password = bcrypt.hash(this.password, 12);
//     this.cpassword = bcrypt.hash(this.cpassword, 12);
//   }
//   next();
// });

const User = new mongoose.model("User", userSchema);
module.exports = User;
