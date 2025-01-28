const express = require("express");
const router = express.Router();
const {
  addTypingStats,
  getTypingStats,
  getLeaderboard,
} = require("../controllers/typingController");
const { authGuard } = require("../middleware/authguard");

// Routes
router.post("/stats", authGuard, addTypingStats);
router.get("/stats", authGuard, getTypingStats);
router.get("/leaderboard", getLeaderboard);

module.exports = router;
