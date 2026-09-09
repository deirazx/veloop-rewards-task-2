const express = require('express');
const router = express.Router();
const Giveaway = require('../models/Giveaway');
const Participation = require('../models/Participation');
const Winner = require('../models/Winner');
const User = require('../models/User');

// GET /api/stats - Aggregates real live platform metrics directly from MongoDB
router.get('/', async (req, res) => {
  try {
    const [
      activeGiveawaysCount,
      totalParticipantsCount,
      totalWinnersCount,
      earliestEndingGiveaway,
      totalRegisteredUsers
    ] = await Promise.all([
      Giveaway.countDocuments({ status: 'ACTIVE' }),
      Participation.countDocuments(),
      Winner.countDocuments(),
      Giveaway.findOne({ status: 'ACTIVE' }).sort({ endAt: 1 }).select('endAt'),
      User.countDocuments()
    ]);

    // Calculate dynamic participants: if few participation records, sum spotsTaken across active giveaways
    let participantsTotal = totalParticipantsCount;
    if (participantsTotal === 0) {
      const activeGiveaways = await Giveaway.find({ status: 'ACTIVE' }).select('spotsTaken currentEntries');
      participantsTotal = activeGiveaways.reduce(
        (sum, g) => sum + Number(g.currentEntries || g.spotsTaken || 0),
        0
      );
    }

    return res.json({
      success: true,
      data: {
        totalGiveaways: activeGiveawaysCount,
        totalParticipants: participantsTotal,
        prizesWon: totalWinnersCount,
        totalUsers: totalRegisteredUsers,
        nextDrawAt: earliestEndingGiveaway?.endAt || new Date(Date.now() + 86400000).toISOString()
      }
    });
  } catch (error) {
    console.error('[Stats API Error]', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve platform stats.'
    });
  }
});

module.exports = router;
