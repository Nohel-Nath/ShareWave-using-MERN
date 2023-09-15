const userDb = require("../models/usersModel");
const storyDb = require("../models/storyModel");
const cloudinary = require("cloudinary");

const createStory = async (req, res) => {
  try {
    const userId = req.user.id;

    // Assuming the image data is sent in the request body as 'image'
    const imageData = req.body.image;

    if (!imageData) {
      return res
        .status(400)
        .json({ success: false, message: "No image data provided" });
    }

    // Calculate the expiration time (1 day from now)
    const expirationTime = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const myCloud = await cloudinary.v2.uploader.upload(imageData, {
      folder: "socialMedia(story)",
    });

    const newStory = new storyDb({
      user: userId,
      content: req.body.content,
      image: {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      },
      createdAt: new Date(), // Set the creation date and time
      expiresAt: expirationTime, // Set the expiration time
    });

    // Save the story to the database
    const story = await newStory.save();

    await userDb.findByIdAndUpdate(userId, {
      $push: { story: story._id },
    });

    res.status(201).json({ success: true, data: story });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllStories = async (req, res) => {
  try {
    // Find all stories that are not expired
    const stories = await storyDb
      .find({ expired: false })
      .populate("user", "name avatar")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, stories });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createStory,
  getAllStories,
};
