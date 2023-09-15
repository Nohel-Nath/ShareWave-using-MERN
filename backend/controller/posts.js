const postDb = require("../models/postsModel");
const userDb = require("../models/usersModel");
const notiDb = require("../models/notificationModel");
const cloudinary = require("cloudinary");
//users
const createPost = async (req, res) => {
  try {
    let image = [];

    if (typeof req.body.image === "string") {
      image.push(req.body.image);
    } else {
      image = req.body.image;
    }

    const imageLinks = [];

    for (let i = 0; i < image.length; i++) {
      const result = await cloudinary.v2.uploader.upload(image[i], {
        folder: "socialmedia(post)",
      });

      imageLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    const newPostData = {
      caption: req.body.caption,
      image: imageLinks,
      owner: req.user._id,
      tags: req.body.tags
        ? req.body.tags.map((tag) => tag.replace("#", ""))
        : [],
      feeling: req.body.feeling,
      location: req.body.location,
    };

    const newPost = await postDb.create(newPostData);
    const user = await userDb.findById(req.user._id);

    user.posts.unshift(newPost._id);

    //await newPost.save();
    await user.save();

    res.status(201).json({
      success: true,
      newPost,
      message: "Post created",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const likePost = async (req, res) => {
  try {
    const post = await postDb.findById(req.params.id);
    const userId = req.user._id;

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    if (post.likes.includes(userId)) {
      const index = post.likes.indexOf(userId);

      post.likes.splice(index, 1);

      await post.save();

      return res.status(200).json({
        success: true,
        message: "Post Disliked",
      });
    } else {
      post.likes.push(userId);

      await post.save();

      // Create a notification for the owner of the post
      const postOwner = await userDb.findById(post.owner);
      if (postOwner && postOwner._id.toString() !== req.user._id.toString()) {
        const newNotification = new notiDb({
          user: post.owner, // The owner of the post
          content: ` ${req.user.avatar.url} ${req.user.name}  liked your post.`,
          type: "like", // Notification type for likes
        });

        const notification = await newNotification.save();

        await userDb.findByIdAndUpdate(postOwner, {
          $push: { notification: notification._id },
        });
      }

      return res.status(200).json({
        success: true,
        message: "Post Liked",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get the like count for a post
const getLikeCount = async (req, res) => {
  try {
    const postId = req.params.postId;

    const post = await postDb.findById(postId);
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    const likeCount = post.likesCount; // Assuming 'likesCount' is a field in the post schema that keeps track of the total likes

    res.status(200).json({
      success: true,
      likeCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Dislike a post
const dislikePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.user._id;

    // Check if the post exists
    const post = await postDb.findById(postId);
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    // Check if the user has liked the post
    if (!post.likes.includes(userId)) {
      return res
        .status(400)
        .json({ success: false, message: "User has not liked the post yet" });
    }

    // Remove the user's ID from the likes array in the post
    post.likes = post.likes.filter(
      (like) => like.toString() !== userId.toString()
    );
    post.likesCount -= 1;

    // Save the updated post
    await post.save();

    res.status(200).json({
      success: true,
      message: "Post disliked successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await postDb.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    if (post.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    //await cloudinary.v2.uploader.destroy(post.image.public_id);

    for (let i = 0; i < post.image.length; i++) {
      await cloudinary.v2.uploader.destroy(post.image[i].public_id);
    }

    await post.deleteOne({ _id: req.params.id });

    const user = await userDb.findById(req.user._id);

    const index = user.posts.indexOf(req.params.id);
    user.posts.splice(index, 1);

    await user.save();

    res.status(200).json({
      success: true,
      message: "Post deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deletePostByAdmin = async (req, res) => {
  try {
    const postId = req.params.id;

    // Check if the post exists
    const post = await postDb.findById(postId).populate("owner");

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Check if the user is an admin
    if (req.user.role !== "admin") {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Only admin can delete posts.",
      });
    }

    // await cloudinary.v2.uploader.destroy(post.image.public_id);

    // await post.remove();
    await post.deleteOne({ _id: req.params.id });

    // Remove the post from the user's posts array
    const user = await userDb.findById(post.owner._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const index = user.posts.indexOf(postId);
    user.posts.splice(index, 1);

    await user.save();

    res.status(200).json({
      success: true,
      message: "Post deleted by admin",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getPostOfFollowing = async (req, res) => {
  try {
    const user = await userDb.findById(req.user._id);

    const following = user.following; // Get the list of users the current user is following

    // Get the list of users who are not blocked by the current user
    const nonBlockedFollowing = following.filter(
      (userId) => !user.blockedUsers.includes(userId)
    );

    // Fetch posts only from non-blocked users
    const posts = await postDb.find({
      owner: {
        $in: nonBlockedFollowing,
        $nin: user.blockedUsers,
      },
    });
    //.populate("owner likes comments.user");

    res.status(200).json({
      success: true,
      //posts: posts.reverse(),
      posts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateCaption = async (req, res) => {
  try {
    const post = await postDb.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    if (post.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // Update the caption field if provided in the request body
    if (req.body.caption) {
      post.caption = req.body.caption;
    }

    // Update the tags field if provided in the request body
    if (req.body.tags) {
      post.tags = req.body.tags.map((tag) => tag.replace("#", ""));
    }

    if (req.body.feeling) {
      post.feeling = req.body.feeling;
    }
    if (req.body.location) {
      post.location = req.body.location;
    }

    await post.save();
    res.status(200).json({
      success: true,
      message: "Post updated",
      post,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const commentOnPost = async (req, res) => {
  try {
    const post = await postDb.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    post.comments.push({
      user: req.user._id,
      comment: req.body.comment,
    });

    await post.save();

    // Create a notification for the owner of the post
    const postOwner = await userDb.findById(post.owner);
    if (postOwner && postOwner._id.toString() !== req.user._id.toString()) {
      const newNotification = new notiDb({
        user: post.owner, // The owner of the post
        content: ` ${req.user.avatar.url} ${req.user.name} commented on your post.`,
        type: "comment", // Notification type for comments
      });

      await newNotification.save();
    }

    return res.status(200).json({
      success: true,
      message: "Comment added",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateComment = async (req, res) => {
  try {
    const postId = req.params.postId;
    const commentId = req.params.commentId;
    const updatedCommentText = req.body.comment;

    const post = await postDb.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const comment = post.comments.find(
      (comment) => comment._id.toString() === commentId
    );

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this comment",
      });
    }

    comment.comment = updatedCommentText;
    await post.save();

    return res.status(200).json({
      success: true,
      message: "Comment updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteComment = async (req, res) => {
  try {
    const postId = req.params.postId;
    const commentId = req.params.commentId;

    const post = await postDb.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const comment = post.comments.find(
      (comment) => comment._id.toString() === commentId
    );

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    const userId = req.user._id.toString();
    const commentOwnerId = comment.user.toString();

    // Check if the user is the post owner or the comment owner
    if (post.owner.toString() === userId || commentOwnerId === userId) {
      // Remove the comment from the comments array
      post.comments.pull({ _id: commentId });
      await post.save();

      return res.status(200).json({
        success: true,
        message: "Comment deleted successfully",
      });
    } else {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this comment",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const viewAllPosts = async (req, res) => {
  try {
    const loggedInUser = await userDb.findById(req.user._id);
    const blockedByUsers = loggedInUser.blockedBy;
    const blockedUsers = loggedInUser.blockedUsers;
    const posts = await postDb
      .find({
        $and: [
          { owner: { $nin: blockedByUsers } }, // Exclude posts from users who have blocked the loggedInUser
          { owner: { $nin: blockedUsers } }, // Exclude posts from users blocked by the loggedInUser
        ],
      })
      .sort({ createdAt: -1 })
      .populate({
        path: "owner likes comments.user",
        select:
          "-email -website -followers -following -role -isBlocked -blockedUsers -blockedBy",
      })
      .exec();

    res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Controller to get all posts
const getAllPostsAdmin = async (req, res) => {
  try {
    const allPosts = await postDb.find().populate("owner", "name avatar"); // populate owner field with username from User model
    res.status(200).json({
      success: true,
      posts: allPosts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getMyPosts = async (req, res) => {
  try {
    const user = await userDb.findById(req.user._id);

    const posts = [];

    for (let i = 0; i < user.posts.length; i++) {
      const post = await postDb
        .findById(user.posts[i])
        .populate("likes comments.user owner");
      posts.push(post);
    }

    res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getUserPosts = async (req, res) => {
  try {
    const user = await userDb.findById(req.params.id);

    const posts = [];

    for (let i = 0; i < user.posts.length; i++) {
      const post = await postDb
        .findById(user.posts[i])
        .populate("likes comments.user owner");
      posts.push(post);
    }

    res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const searchPostsByTags = async (req, res) => {
  try {
    const { tags, name } = req.query;

    let posts = [];
    let users = [];

    // Search for posts by tags
    if (tags) {
      let tagsArray = [];
      if (Array.isArray(tags)) {
        tagsArray = tags;
      } else if (typeof tags === "string") {
        tagsArray = tags.split(",");
      }
      posts = await postDb
        .find({ tags: { $in: tagsArray } })
        .populate("owner", "name avatar");
    }

    // Search for users by name
    if (name) {
      const loggedInUserIsAdmin = req.user && req.user.role === "admin";
      const userQuery = loggedInUserIsAdmin ? {} : { role: "user" };

      if (req.user) {
        userQuery._id = {
          $nin: [...req.user.blockedUsers, ...req.user.blockedBy],
        };
      }

      userQuery.name = {
        $regex: name,
        $options: "i", // Case-insensitive search
      };

      users = await userDb
        .find(userQuery, {
          _id: 1,
          name: 1,
          email: 1,
          website: 1,
          avatar: 1,
          posts: 1,
        })
        .populate("posts");

      // Map over the users array to remove the unwanted fields from each user object
      const sanitizedUsers = users.map((user) => {
        const { _id, name, email, website, posts, avatar } = user;
        return { _id, name, email, website, posts, avatar };
      });
      users = sanitizedUsers;
    }

    res.status(200).json({
      success: true,
      posts,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createPost,
  likePost,
  dislikePost,
  getLikeCount,
  deletePost,
  deletePostByAdmin,
  getPostOfFollowing,
  updateCaption,
  commentOnPost,
  updateComment,
  deleteComment,
  viewAllPosts,
  getAllPostsAdmin,
  getMyPosts,
  getUserPosts,
  searchPostsByTags,
};
