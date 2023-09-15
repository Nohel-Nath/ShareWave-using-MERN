const notiDb = require("../models/notificationModel");

const getNotifications = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming you're using authentication middleware to set req.user

    // Fetch all notifications for the user (both read and unread)
    const notifications = await notiDb
      .find({ user: userId })
      .sort({ createdAt: -1 }) // Sort by the most recent notifications first
      .populate("user", "name avatar"); // Populate the 'user' field with the name of the user who triggered the notification

    return res.status(200).json({
      success: true,
      notifications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteNotifications = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming you're using authentication middleware to set req.user
    const notificationId = req.params.notificationId; // Assuming you pass the notification ID as a route parameter

    // Find the notification by ID and user ID
    const notification = await notiDb.findOne({
      _id: notificationId,
      user: userId,
    });

    // If the notification doesn't exist or doesn't belong to the user, return an error
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found or doesn't belong to the user.",
      });
    }

    // Delete the notification using the Mongoose model
    await notiDb.deleteOne({ _id: notificationId });

    return res.status(200).json({
      success: true,
      message: "Notification deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getNotifications,
  deleteNotifications,
};
