const mongoose = require("mongoose");

const storySchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    content: {
      type: String,
    },
    image: {
      public_id: String,
      url: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      default: function () {
        return new Date(Date.now() + 24 * 60 * 60 * 1000); // Set the expiration to 1 day from now
      },
    },

    expired: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const storyDb = mongoose.model("Story", storySchema);
module.exports = storyDb;
