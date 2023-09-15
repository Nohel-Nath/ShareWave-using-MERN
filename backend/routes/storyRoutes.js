const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({ extended: false }));
router.use(express.json());
const dotenv = require("dotenv");
dotenv.config({ path: ".env" });
const storyController = require("../controller/stories");
const { isAuthenticatedUser } = require("../middleware/auth");

router.post("/create", isAuthenticatedUser, storyController.createStory);
router.get("/all", isAuthenticatedUser, storyController.getAllStories);
module.exports = router;
