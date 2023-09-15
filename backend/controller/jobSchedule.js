const schedule = require("node-schedule");
const storyDb = require("../models/storyModel");

// Schedule a job to run every hour
const job = schedule.scheduleJob("0 */1 * * *", async () => {
  try {
    // Find and mark expired stories
    const currentTime = new Date();

    // Assuming that your stories are stored in UTC time
    await storyDb.updateMany(
      { expiresAt: { $lt: currentTime }, expired: false },
      { $set: { expired: true } }
    );
  } catch (error) {
    console.error("Error marking expired stories:", error);
  }
});
