const userDb = require("../models/usersModel");
const validator = require("validator");
const sendToken = require("../utils/jwtToken");
const postDb = require("../models/postsModel");
const notiDb = require("../models/notificationModel");
const sendEmail = require("../middleware/sendEmail");
const crypto = require("crypto");
const cloudinary = require("cloudinary");

//users
const createUser = async (req, res) => {
  try {
    const { name, email, password, website, avatar } = req.body;

    if (!name || !email || !password || !website) {
      return res.status(400).json({ error: "Please Enter All The Details" });
    }

    // Check if the user already exists
    const existingUser = await userDb.findOne({ email });
    if (existingUser) {
      if (existingUser.isBlocked) {
        return res.status(400).json({
          error:
            "User with this email is banned and cannot register a new account",
        });
      }
      return res
        .status(400)
        .json({ error: "User already exists with this email" });
    }
    const myCloud = await cloudinary.v2.uploader.upload(avatar, {
      folder: "socialmediavatars",
    });

    if (website) {
      if (!validator.isURL(website)) {
        return res
          .status(400)
          .json({ error: "Please enter a valid URL for the website" });
      }
    }

    // Create the new user
    const newUser = await userDb.create({
      name,
      email,
      password,
      avatar: { public_id: myCloud.public_id, url: myCloud.secure_url },
      website,
    });

    await newUser.save();
    const token = sendToken(newUser, 200, res);

    res.status(201).json({
      success: true,
      newUser,
      token,
      message: "User created",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Please Enter All The Details" });
    }

    const user = await userDb
      .findOne({ email })
      .select("+password")
      .populate("posts followers following");
    // .populate("posts followers following");

    if (!user) {
      return res.status(400).json({ error: "Invalid User" });
    }

    if (user.isBlocked) {
      return res.status(400).json({ error: "This email is blocked" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid password" });
    }

    const token = sendToken(user, 200, res);

    res.status(200).json({
      success: true,
      user,
      token,
      message: "User logged in",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const logoutUser = async (req, res) => {
  try {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });
    res.status(200).json({
      success: true,
      message: "Logged Out",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const followUser = async (req, res) => {
  try {
    const userToFollow = await userDb.findById(req.params.id);
    const loggedInUser = await userDb.findById(req.user._id);

    if (!userToFollow) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if the userToFollow is blocked by loggedInUser
    if (loggedInUser.blockedUsers.includes(userToFollow._id)) {
      return res.status(403).json({
        success: false,
        message: "You can't follow a blocked user",
      });
    }

    if (!loggedInUser.following.includes(userToFollow._id)) {
      // User is following another user
      loggedInUser.following.push(userToFollow._id);
      userToFollow.followers.push(loggedInUser._id);

      await loggedInUser.save();
      await userToFollow.save();

      // Create a notification for the userToFollow
      const newNotification = new notiDb({
        user: userToFollow._id, // The user being followed
        content: ` ${req.user.avatar.url} ${req.user.name} started following you.`,
        type: "follow", // Notification type for follows
      });

      await newNotification.save();

      return res.status(200).json({
        success: true,
        message: "User followed",
      });
    } else {
      // User is unfollowing the userToFollow
      const indexFollowing = loggedInUser.following.indexOf(userToFollow._id);
      const indexFollowers = userToFollow.followers.indexOf(loggedInUser._id);

      loggedInUser.following.splice(indexFollowing, 1);
      userToFollow.followers.splice(indexFollowers, 1);

      await loggedInUser.save();
      await userToFollow.save();

      return res.status(200).json({
        success: true,
        message: "User Unfollowed",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const blockUser = async (req, res) => {
  try {
    const userToBlock = await userDb.findById(req.params.id);
    const loggedInUser = await userDb.findById(req.user._id);

    if (!userToBlock) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if the userToBlock is already blocked by loggedInUser
    if (loggedInUser.blockedUsers.includes(userToBlock._id)) {
      return res.status(400).json({
        success: false,
        message: "User is already blocked",
      });
    }

    // Block the user
    loggedInUser.blockedUsers.push(userToBlock._id);
    userToBlock.blockedBy.push(loggedInUser._id);

    // Remove from following list if the userToBlock is being followed by loggedInUser
    const indexFollowing = loggedInUser.following.indexOf(userToBlock._id);
    if (indexFollowing !== -1) {
      loggedInUser.following.splice(indexFollowing, 1);
    }

    // Remove from followers list if loggedInUser is being followed by userToBlock
    const indexFollowers = userToBlock.followers.indexOf(loggedInUser._id);
    if (indexFollowers !== -1) {
      userToBlock.followers.splice(indexFollowers, 1);
    }

    await loggedInUser.save();
    await userToBlock.save();

    res.status(200).json({
      success: true,
      message: "User blocked",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getBlockList = async (req, res) => {
  try {
    const loggedInUser = await userDb
      .findById(req.user._id)
      .populate("blockedUsers", "name avatar");

    res.status(200).json({
      success: true,
      blockedUsers: loggedInUser.blockedUsers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const unblockUser = async (req, res) => {
  try {
    const userToUnblock = await userDb.findById(req.params.id);
    const loggedInUser = await userDb.findById(req.user._id);

    if (!userToUnblock) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if the userToUnblock is blocked by loggedInUser
    if (!loggedInUser.blockedUsers.includes(userToUnblock._id)) {
      return res.status(400).json({
        success: false,
        message: "User is not blocked",
      });
    }

    // Unblock the user
    const index = loggedInUser.blockedUsers.indexOf(userToUnblock._id);
    loggedInUser.blockedUsers.splice(index, 1);

    // Remove the userToUnblock from the blockedBy array of loggedInUser
    const blockedByIndex = userToUnblock.blockedBy.indexOf(loggedInUser._id);
    if (blockedByIndex !== -1) {
      userToUnblock.blockedBy.splice(blockedByIndex, 1);
    }

    await loggedInUser.save();
    await userToUnblock.save();

    res.status(200).json({
      success: true,
      message: "User unblocked",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updatePassword = async (req, res) => {
  try {
    const user = await userDb.findById(req.user._id).select("+password");

    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide old and new password",
      });
    }

    const isMatch = await user.comparePassword(oldPassword);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect Old password",
      });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password Updated",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const user = await userDb.findById(req.user._id);

    const { name, email, website, avatar } = req.body;

    if (name) {
      user.name = name;
    }
    if (email) {
      user.email = email;
    }
    if (website) {
      user.website = website;
    }
    if (avatar) {
      await cloudinary.v2.uploader.destroy(user.avatar.public_id);

      const myCloud = await cloudinary.v2.uploader.upload(avatar, {
        folder: "socialmediavatars",
      });
      user.avatar.public_id = myCloud.public_id;
      user.avatar.url = myCloud.secure_url;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile Updated",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const myProfile = async (req, res) => {
  try {
    const user = await userDb
      .findById(req.user._id)
      .populate("posts followers following");

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteMyProfile = async (req, res) => {
  try {
    const user = await userDb.findById(req.user._id);
    const posts = user.posts;
    const followers = user.followers;
    const following = user.following;
    const userId = user._id;

    // Removing Avatar from cloudinary
    await cloudinary.v2.uploader.destroy(user.avatar.public_id);

    // await user.remove();
    await user.deleteOne();

    // Logout user after deleting profile

    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });

    // Delete all posts of the user
    // Deleting all posts of the user
    for (let i = 0; i < posts.length; i++) {
      const post = await postDb.findById(posts[i]);

      // Deleting images associated with the post
      for (let j = 0; j < post.image.length; j++) {
        await cloudinary.v2.uploader.destroy(post.image[j].public_id);
      }

      // Removing comments of the user from the post
      post.comments = post.comments.filter(
        (comment) => comment.user !== userId
      );

      // Removing likes of the user from the post
      post.likes = post.likes.filter((like) => like !== userId);

      // Save the updated post
      await post.save();

      // Deleting the post itself
      await post.deleteOne();
    }

    // Removing User from Followers Following
    for (let i = 0; i < followers.length; i++) {
      const follower = await userDb.findById(followers[i]);
      const index = follower.following.indexOf(userId);
      follower.following.splice(index, 1);
      await follower.save();
    }

    // Removing User from Following's Followers
    for (let i = 0; i < following.length; i++) {
      const follows = await userDb.findById(following[i]);
      const index = follows.followers.indexOf(userId);
      follows.followers.splice(index, 1);
      await follows.save();
    }

    // removing all comments of the user from all posts
    const allPosts = await postDb.find();

    for (let i = 0; i < allPosts.length; i++) {
      const post = await postDb.findById(allPosts[i]._id);

      for (let j = 0; j < post.comments.length; j++) {
        if (post.comments[j].user === userId) {
          post.comments.splice(j, 1);
        }
      }
      await post.save();
    }
    // removing all likes of the user from all posts

    for (let i = 0; i < allPosts.length; i++) {
      const post = await postDb.findById(allPosts[i]._id);

      for (let j = 0; j < post.likes.length; j++) {
        if (post.likes[j] === userId) {
          post.likes.splice(j, 1);
        }
      }
      await post.save();
    }

    res.status(200).json({
      success: true,
      message: "Profile Deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllUsersAdmin = async (req, res) => {
  try {
    const usersCount = await userDb.countDocuments({
      isBlocked: false,
    });
    const users = await userDb
      .find({
        role: { $in: ["user", "admin"] },
        isBlocked: false,
      })
      .select("-password");

    res.status(200).json({
      success: true,
      users,
      usersCount,
    });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong", error });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    // Find the user to be deleted
    const userToDelete = await userDb.findById(id);

    // Check if the user exists
    if (!userToDelete) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the user is an admin (admins cannot delete other admins)
    if (userToDelete.role === "admin") {
      return res.status(403).json({
        error: "Admins cannot be deleted by other admins",
      });
    }

    // Logout user after deleting profile

    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });

    // Delete all posts of the user
    for (const postId of userToDelete.posts) {
      await postDb.findByIdAndDelete(postId);
    }

    // Removing User from Followers' Following
    for (const followerId of userToDelete.followers) {
      const follower = await userDb.findById(followerId);
      const index = follower.following.indexOf(id);
      follower.following.splice(index, 1);
      await follower.save();
    }

    // Removing User from Following's Followers
    for (const followingId of userToDelete.following) {
      const follows = await userDb.findById(followingId);
      const index = follows.followers.indexOf(id);
      follows.followers.splice(index, 1);
      await follows.save();
    }

    // Remove user's likes from all posts
    const allPosts = await postDb.find();
    for (const post of allPosts) {
      const index = post.likes.indexOf(id);
      if (index !== -1) {
        post.likes.splice(index, 1);
        await post.save();
      }
    }

    // Find all comments made by the user on other users' posts
    const userComments = await postDb.find({ "comments.user": id });

    // Remove the user's comments from the respective posts
    for (const post of userComments) {
      post.comments = post.comments.filter(
        (comment) => comment.user.toString() !== id
      );
      await post.save();
    }

    // Delete the user using the deleteOne() method
    await userDb.deleteOne({ _id: id });

    res.status(200).json({ success: true, message: "User deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const blockUserAdmin = async (req, res) => {
  try {
    const userId = req.params.id;
    // Find the user to be blocked
    const user = await userDb.findById(userId);

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the user is already blocked
    if (user.isBlocked) {
      return res.status(400).json({
        error: "User is already blocked",
      });
    }

    if (user.role === "admin") {
      return res.status(403).json({
        error: "You cannot block other admins",
      });
    }

    // Set the isBlocked flag to true and save the user
    user.isBlocked = true;
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "User blocked successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getBlockedList = async (req, res) => {
  try {
    const blockedUsers1 = await userDb.find({ isBlocked: true });
    //console.log(blockedUsers1);
    res.status(200).json(blockedUsers1);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const unblockUserAdmin = async (req, res) => {
  try {
    const userId = req.params.id;

    // Find the user by ID
    const user = await userDb.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    // Check if the user is already unblocked
    if (!user.isBlocked) {
      return res.status(400).json({ error: "User is already unblocked" });
    }

    // Set the isBlocked flag to false and save the user
    user.isBlocked = false;
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "User unblocked successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateUserRoleAdmin = async (req, res) => {
  try {
    const newUserData = {
      name: req.body.name,
      email: req.body.email,
      role: req.body.role,
    };
    const user = await userDb.findByIdAndUpdate(req.params.id, newUserData, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    res.status(200).json({
      success: true,
      user,
      message: "Role updated successfully",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const user = await userDb
      .findById(req.params.id)
      .populate("posts followers following");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    // Remove the followers and following fields from the user object

    user.isBlocked = undefined;
    user.blockedUsers = undefined;
    user.role = undefined;

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const loggedInUserIsAdmin = req.user && req.user.role === "admin";
    const query = loggedInUserIsAdmin ? {} : { role: "user" };

    if (req.user) {
      const loggedInUserId = req.user.id;
      query._id = {
        $nin: [...req.user.blockedUsers, ...req.user.blockedBy, loggedInUserId],
      };
    }

    const users = await userDb
      .find(query, {
        _id: 1,
        name: 1,
        email: 1,
        website: 1,
        avatar: 1,
        posts: 1,
      })
      .limit(15)
      .populate("posts")
      .sort({ createdAt: -1 });

    // Map over the users array to remove the unwanted fields from each user object
    const sanitizedUsers = users.map((user) => {
      const { _id, name, email, website, posts, avatar } = user;
      return { _id, name, email, website, posts, avatar };
    });

    res.status(200).json({
      success: true,
      sanitizedUsers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const user = await userDb.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const resetPasswordToken = user.getResetPasswordToken();

    await user.save();

    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/user/password-reset/${resetPasswordToken}`;

    const message = `Reset Your Password by clicking on the link below: \n\n ${resetUrl}`;

    try {
      await sendEmail({
        email: user.email,
        subject: "Reset Password",
        message,
      });

      res.status(200).json({
        success: true,
        message: `Email sent to ${user.email}`,
      });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await userDb.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Token is invalid or has expired",
      });
    }

    user.password = req.body.password;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password Updated",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getUserDetailsAdmin = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await userDb
      .findOne({
        _id: userId,
        isBlocked: false,
      })
      .select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found or user is blocked.",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createUser,
  loginUser,
  logoutUser,
  followUser,
  blockUser,
  unblockUser,
  getBlockList,
  updatePassword,
  updateProfile,
  myProfile,
  deleteMyProfile,
  getAllUsersAdmin,
  deleteUser,
  blockUserAdmin,
  getBlockedList,
  unblockUserAdmin,
  updateUserRoleAdmin,
  getUserDetailsAdmin,
  getUserProfile,
  getAllUsers,
  forgotPassword,
  resetPassword,
};
