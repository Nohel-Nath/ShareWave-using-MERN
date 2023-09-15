const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");

router.use(bodyParser.urlencoded({ extended: false }));
router.use(express.json());
const dotenv = require("dotenv");
dotenv.config({ path: ".env" });
const userController = require("../controller/users");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

router.post("/registration", userController.createUser);
router.post("/login", userController.loginUser);
router.get("/logout", isAuthenticatedUser, userController.logoutUser);

router.get("/follow/:id", isAuthenticatedUser, userController.followUser);

router.post("/block/:id", isAuthenticatedUser, userController.blockUser);
router.post("/unblock/:id", isAuthenticatedUser, userController.unblockUser);
router.get("/blocklist", isAuthenticatedUser, userController.getBlockList);
router.put(
  "/passwordUpdate",
  isAuthenticatedUser,
  userController.updatePassword
);
router.put("/profileUpdate", isAuthenticatedUser, userController.updateProfile);
router.get("/profile", isAuthenticatedUser, userController.myProfile);

router.delete("/deleteMe", isAuthenticatedUser, userController.deleteMyProfile);

router.get(
  "/allUsers",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  userController.getAllUsersAdmin
);

router.delete(
  "/deleteUsers/:id",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  userController.deleteUser
);

router.post(
  "/blockUser/:id",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  userController.blockUserAdmin
);

router.get(
  "/blockByAdmin",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  userController.getBlockedList
);

router.post(
  "/unblockUser/:id",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  userController.unblockUserAdmin
);

router.put(
  "/updateRole/:id",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  userController.updateUserRoleAdmin
);

router.get(
  "/userProfile/:id",
  isAuthenticatedUser,
  userController.getUserProfile
);

router.get("/usersAll", isAuthenticatedUser, userController.getAllUsers);
router.post("/password-forgot", userController.forgotPassword);
router.put("/password-reset/:token", userController.resetPassword);

router.get(
  "/details/:userId",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  userController.getUserDetailsAdmin
);

module.exports = router;
