const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  caption: String,

  image: [
    {
      public_id: String,
      url: String,
    },
  ],

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  tags: [
    {
      type: String,
    },
  ],

  feeling: {
    type: String,
    enum: [
      "", // Empty string as a valid option
      "happy",
      "sad",
      "angry",
      "excited",
      "loved",
      "grateful",
      "crazy",
      "cool",
      "chill",
      "motivated",
    ],
    default: "", // Set a default value (optional)
  },
  location: {
    type: String,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  updatedAt: {
    type: Date,
    default: null,
  },

  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],

  likesCount: {
    type: Number,
    default: 0,
  },

  comments: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],
});

// Pre-save middleware to update the updatedAt field
postSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

const postDb = mongoose.model("Post", postSchema);
module.exports = postDb;
