const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({ extended: false }));
router.use(express.json());
const dotenv = require("dotenv");
dotenv.config({ path: ".env" });
const notificationController = require("../controller/notifications");
const { isAuthenticatedUser } = require("../middleware/auth");

router.get(
  "/all",
  isAuthenticatedUser,
  notificationController.getNotifications
);
router.delete(
  "/delete/:notificationId",
  isAuthenticatedUser,
  notificationController.deleteNotifications
);

module.exports = router;
