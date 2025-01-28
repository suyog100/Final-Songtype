// controllers/typingController.js
const TypingModel = require("../models/typingModel");

const addTypingStats = async (req, res) => {
  try {
    const { wpm, accuracy } = req.body;
    const userId = req.user.id;

    // Find existing record for user or create new one
    let userStats = await TypingModel.findOne({ user: userId });

    if (!userStats) {
      // If no record exists, create new one
      userStats = new TypingModel({
        user: userId,
        wpm: [],
        accuracies: [],
      });
    }

    // Push new values to arrays
    userStats.wpm.push(wpm);
    userStats.accuracies.push(accuracy);

    // Save the updated document
    await userStats.save();

    res.status(200).json({
      success: true,
      message: "Typing stats updated successfully",
      data: userStats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating typing stats",
      error: error.message,
    });
  }
};

// Get user's typing stats
const getTypingStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const userStats = await TypingModel.findOne({ user: userId });

    if (!userStats) {
      return res.status(404).json({
        success: false,
        message: "No typing stats found for this user",
      });
    }

    res.status(200).json({
      success: true,
      data: userStats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching typing stats",
      error: error.message,
    });
  }
};

const getLeaderboard = async (req, res) => {
  try {
    // Aggregate pipeline to calculate stats and sort by highest WPM
    const leaderboard = await TypingModel.aggregate([
      {
        // Lookup to get user details
        $lookup: {
          from: "users", // assuming your users collection name
          localField: "user",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: "$userDetails",
      },
      {
        // Calculate required statistics
        $project: {
          username: "$userDetails.username",
          // Get the highest WPM
          maxWPM: { $max: "$wpm" },
          // Calculate average accuracy
          avgAccuracy: {
            $round: [
              {
                $avg: "$accuracies",
              },
              2,
            ],
          },
        },
      },
      // Sort by highest WPM in descending order
      { $sort: { maxWPM: -1 } },
      // Limit to top 10 results (optional - adjust as needed)
      { $limit: 10 },
    ]);

    if (!leaderboard.length) {
      return res.status(404).json({
        success: false,
        message: "No typing stats found",
      });
    }

    res.status(200).json({
      success: true,
      data: leaderboard,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching leaderboard",
      error: error.message,
    });
  }
};

module.exports = {
  addTypingStats,
  getTypingStats,
  getLeaderboard,
};
