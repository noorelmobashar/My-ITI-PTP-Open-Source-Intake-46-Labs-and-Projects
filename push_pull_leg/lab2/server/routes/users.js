const express = require("express");
const User = require("../models/User");
const auth = require("../middleware/auth");

const router = express.Router();

// =============================================
// GET /api/users/search?username=<query>
// Search for users by username (partial match)
// Used to find users to start a chat or add to a group
// Requires: Valid JWT token
// =============================================
router.get("/search", auth, async (req, res) => {
  try {
    const { username } = req.query;

    if (!username) {
      return res.status(400).json({ message: "Username query is required" });
    }

    // Find users whose username contains the search query (case-insensitive)
    // Exclude the current user from search results
    // Exclude passwords from the response
    const users = await User.find({
      username: { $regex: username, $options: "i" },
      _id: { $ne: req.user.id }, // Don't show the searching user
    })
      .select("-password")
      .limit(20); // Limit results to prevent huge responses

    res.json(users);
  } catch (error) {
    console.error("User search error:", error);
    res.status(500).json({ message: "Server error during user search" });
  }
});

module.exports = router;
