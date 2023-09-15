const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter a name"],
      unique: [true, "Name already exists"],
    },
    avatar: {
      public_id: String,
      url: String,
    },
    email: {
      type: String,
      required: [true, "Please enter an email"],
      unique: [true, "Email already exists"],
      validate: [validator.isEmail, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Please enter a password"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },

    website: {
      type: String,
      validate: {
        validator: validator.isURL,
        message: "Please enter a valid URL for the website",
      },
    },
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    role: {
      type: String,
      default: "user",
    },
    //admin
    isBlocked: {
      type: Boolean,
      default: false,
    },
    blockedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    blockedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    story: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Story",
      },
    ],
    notification: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Notification",
      },
    ],

    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true } // Add timestamps option here
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

//JWT-token
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Compare Password
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const userDb = mongoose.model("User", userSchema);
module.exports = userDb;
