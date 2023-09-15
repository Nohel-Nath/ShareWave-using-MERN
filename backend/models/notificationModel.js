const mongoose = require("mongoose");

const notificationSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    content: String,
    type: {
      type: String,
      enum: ["like", "comment", "follow"],
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const notiDb = mongoose.model("Notification", notificationSchema);

module.exports = notiDb;
