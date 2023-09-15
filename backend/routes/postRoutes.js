const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({ extended: false }));
router.use(express.json());
const dotenv = require("dotenv");
dotenv.config({ path: ".env" });
const postController = require("../controller/posts");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

router.post("/upload", isAuthenticatedUser, postController.createPost);
router.get("/:id/like", isAuthenticatedUser, postController.likePost);
router.post(
  "/:postId/dislike",
  isAuthenticatedUser,
  postController.dislikePost
);
router.get("/:postId/likeCount", postController.getLikeCount);
router.delete("/:id/delete", isAuthenticatedUser, postController.deletePost);
router.delete(
  "/:id/deletebyadmin",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  postController.deletePostByAdmin
);
router.get("/posts", isAuthenticatedUser, postController.getPostOfFollowing);
router.put("/update/:id", isAuthenticatedUser, postController.updateCaption);
router.post(
  "/postComment/:id",
  isAuthenticatedUser,
  postController.commentOnPost
);
router.put(
  "/:postId/comments/:commentId",
  isAuthenticatedUser,
  postController.updateComment
);
router.delete(
  "/:postId/delete/:commentId",
  isAuthenticatedUser,
  postController.deleteComment
);
router.get("/allPosts", isAuthenticatedUser, postController.viewAllPosts);
router.get(
  "/postsAdmin",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  postController.getAllPostsAdmin
);
router.get("/myPosts", isAuthenticatedUser, postController.getMyPosts);
router.get("/userPosts/:id", isAuthenticatedUser, postController.getUserPosts);
router.get("/search", isAuthenticatedUser, postController.searchPostsByTags);
module.exports = router;
