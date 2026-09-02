const Giveaway = require('../models/Giveaway');
const Winner = require('../models/Winner');

/**
 * Get all current and upcoming active giveaways
 * Endpoint: GET /api/giveaways/current
 */
exports.getCurrentGiveaways = async (req, res) => {
  try {
    const giveaways = await Giveaway.find({
      status: { $in: ['ACTIVE', 'UPCOMING'] }
    }).sort({ endAt: 1 });

    return res.json({
      success: true,
      count: giveaways.length,
      data: giveaways
    });
  } catch (error) {
    console.error('[Get Current Giveaways Error]', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch current giveaways.'
    });
  }
};

/**
 * Get winners for a specific giveaway
 * Endpoint: GET /api/giveaways/:id/winners
 * SPEC CHECK: If ACTIVE, return a notice that winners are announced post-countdown; never display fake winners prematurely.
 */
exports.getGiveawayWinners = async (req, res) => {
  try {
    const { id } = req.params;

    const giveaway = await Giveaway.findOne({
      $or: [{ giveawayId: id }, { slug: id }]
    });

    if (!giveaway) {
      return res.status(404).json({
        success: false,
        message: 'Giveaway not found.'
      });
    }

    // Strict Anti-Premature Winner Leakage Rule
    if (giveaway.status === 'ACTIVE' || giveaway.status === 'UPCOMING') {
      return res.json({
        success: true,
        giveawayId: giveaway.giveawayId,
        status: giveaway.status,
        endsAt: giveaway.endAt,
        isLive: true,
        notice: 'Giveaway is still live. Winners announced post-countdown.',
        winners: [] // Strictly empty while active
      });
    }

    // If ENDED or ARCHIVED: Return official audited winners
    const winners = await Winner.find({ giveawayId: giveaway.giveawayId })
      .select('maskedUserId ticketNumber prizeName prizeType drawTimestamp claimStatus provableSeed customUserId')
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      giveawayId: giveaway.giveawayId,
      status: giveaway.status,
      isLive: false,
      winners
    });
  } catch (error) {
    console.error('[Get Giveaway Winners Error]', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve giveaway winners.'
    });
  }
};

/**
 * Get past/concluded giveaways and historical winners
 * Endpoint: GET /api/giveaways/previous/winners
 */
exports.getPreviousWinners = async (req, res) => {
  try {
    const pastGiveaways = await Giveaway.find({
      status: { $in: ['ENDED', 'ARCHIVED'] }
    }).sort({ endAt: -1 });

    const pastGiveawayIds = pastGiveaways.map((g) => g.giveawayId);

    const winners = await Winner.find({
      giveawayId: { $in: pastGiveawayIds }
    }).sort({ drawTimestamp: -1 });

    const results = pastGiveaways.map((g) => {
      const gWinners = winners.filter((w) => w.giveawayId === g.giveawayId);
      return {
        giveawayId: g.giveawayId,
        title: g.title,
        slug: g.slug,
        category: g.category,
        endedAt: g.endAt,
        prizes: g.prizes,
        winners: gWinners
      };
    });

    return res.json({
      success: true,
      count: results.length,
      data: results
    });
  } catch (error) {
    console.error('[Get Previous Winners Error]', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve previous winners.'
    });
  }
};
