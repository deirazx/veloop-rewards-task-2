const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const GRADIENTS = [
  'from-amber-300 via-amber-400 to-yellow-500', // 1st
  'from-slate-200 via-cyan-100 to-slate-400',   // 2nd
  'from-amber-600 via-orange-500 to-amber-700', // 3rd
  'from-violet-500 to-purple-600',
  'from-blue-500 to-cyan-500',
  'from-emerald-500 to-teal-500',
  'from-rose-500 to-pink-500',
  'from-indigo-500 to-violet-500',
  'from-amber-400 to-orange-500',
  'from-cyan-500 to-blue-500'
];

// Helper to decode user from Authorization header if present
const resolveRequestUser = async (req) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'veloop_rewards_secret_key_2026_jwt_token'
      );
      if (decoded && decoded.id) {
        return await User.findById(decoded.id).select('-password');
      }
    }
  } catch (err) {
    // Non-blocking: guest request
  }
  return null;
};

// GET /api/leaderboard?filter=Daily | Weekly | Monthly | All-Time
router.get('/', async (req, res) => {
  try {
    const rawFilter = (req.query.filter || 'Weekly').trim();
    const filterKey = rawFilter.toUpperCase().replace('-', '_'); // e.g. DAILY, WEEKLY, MONTHLY, ALL_TIME

    // Fetch all active users from MongoDB
    const users = await User.find({ isSuspended: false })
      .select('customUserId name tier stats balances avatar')
      .lean();

    // Calculate authentic points (matching user's actual VES coins) and dynamic initials
    const computedUsers = users.map((u, i) => {
      const stats = u.stats || {};
      const balances = u.balances || {};

      // Authoritative points matching actual VES coins
      const vesBalance = Number(balances.VES ?? balances.VEs ?? stats.points ?? 0);
      let points = vesBalance;
      if (filterKey.includes('ALL')) {
        points = vesBalance + Number(balances.Tokens || 0);
      }

      const rawId = u.customUserId || String(u._id);
      const clean = rawId.replace(/^@/, '');
      const masked = clean.length >= 4
        ? `@${clean.slice(0, 2).toLowerCase()}****${clean.slice(-2).toLowerCase()}`
        : '@ve****99';

      // Authentic Name Initials:
      // If space present: first letter of first name + first letter of second name
      // Otherwise: starting 2 letters of name
      let initial = 'VE';
      const actualName = (u.name || '').trim();
      if (actualName) {
        const parts = actualName.split(/\s+/).filter(Boolean);
        if (parts.length >= 2) {
          initial = (parts[0][0] + parts[1][0]).toUpperCase();
        } else if (actualName.length >= 2) {
          initial = actualName.slice(0, 2).toUpperCase();
        } else {
          initial = actualName.toUpperCase();
        }
      } else if (u.customUserId) {
        initial = u.customUserId.slice(0, 2).toUpperCase();
      }

      const streak = (stats.wins && stats.wins > 0) ? `⚡ ${stats.wins} Win Streak` : 'Active Hunter';

      return {
        id: u._id,
        customUserId: masked,
        name: masked,
        actualName: u.name,
        masked,
        avatar: null,
        initial,
        initials: initial,
        points: Number(points) || 0,
        pointsRaw: Number(points) || 0,
        wins: Number(stats.wins) || 0,
        entries: Number(stats.entries) || 0,
        change: 0,
        badge: stats.badge || u.tier || 'Contender',
        streak,
        tier: u.tier || 'Standard'
      };
    });

    // Strictly sort descending by points (Highest points first, with tie-breakers)
    computedUsers.sort((a, b) => {
      const diff = Number(b.points) - Number(a.points);
      if (diff !== 0) return diff;
      const entriesDiff = Number(b.entries) - Number(a.entries);
      if (entriesDiff !== 0) return entriesDiff;
      return Number(b.wins) - Number(a.wins);
    });

    // Assign rank and reliable CSS gradients
    const STYLES = [
      'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', // 1st Gold
      'linear-gradient(135deg, #94a3b8 0%, #475569 100%)', // 2nd Silver
      'linear-gradient(135deg, #b45309 0%, #78350f 100%)', // 3rd Bronze
      'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
      'linear-gradient(135deg, #2563eb 0%, #06b6d4 100%)',
      'linear-gradient(135deg, #059669 0%, #0d9488 100%)',
      'linear-gradient(135deg, #e11d48 0%, #db2777 100%)',
      'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
      'linear-gradient(135deg, #d97706 0%, #ea580c 100%)',
      'linear-gradient(135deg, #0891b2 0%, #2563eb 100%)'
    ];

    const rankedUsers = computedUsers.map((u, idx) => ({
      ...u,
      rank: idx + 1,
      gradientStyle: STYLES[idx % STYLES.length],
      gradient: GRADIENTS[idx % GRADIENTS.length]
    }));

    // Top 10 for leaderboard showcase
    const displayList = rankedUsers.slice(0, 10);

    // Resolve authenticated requesting user standing
    const authUser = await resolveRequestUser(req);
    let userStanding = null;

    if (authUser) {
      const userIndex = rankedUsers.findIndex(
        (u) => String(u.id) === String(authUser._id) || u.customUserId === authUser.customUserId
      );

      const rank = userIndex !== -1 ? userIndex + 1 : rankedUsers.length + 1;
      const myPoints = userIndex !== -1 ? rankedUsers[userIndex].points : (authUser.stats?.weeklyPoints || 0);
      
      const targetRank = rank <= 10 ? 1 : 10;
      const targetUser = rankedUsers[targetRank - 1];
      const targetPoints = targetUser ? targetUser.points : Math.max(1000, myPoints + 1500);

      userStanding = {
        rank,
        points: myPoints,
        nextRankPoints: targetPoints,
        nextRank: targetRank,
        badge: authUser.tier || 'Rising Contender',
        name: authUser.name || 'You',
        masked: authUser.customUserId ? `@${authUser.customUserId}` : `@user_${String(authUser._id).slice(-4)}`,
        avatar: authUser.stats?.avatar || authUser.avatar || null
      };
    } else {
      // Default guest standing preview based on real database thresholds
      const top10Threshold = displayList[displayList.length - 1]?.points || 1000;
      userStanding = {
        rank: Math.max(rankedUsers.length + 1, 8),
        points: 0,
        nextRankPoints: top10Threshold,
        nextRank: 10,
        badge: 'New Contender',
        name: 'You',
        masked: '@guest'
      };
    }

    // Calculate real prize pool & real active hunters
    const activeCount = users.length;
    const poolInfo = {
      prizePool: 'Season 1 Rewards • 6 Live Pools',
      activeHunters: `${activeCount} Registered Hunter${activeCount === 1 ? '' : 's'}`
    };

    return res.json({
      success: true,
      count: displayList.length,
      filter: rawFilter,
      data: displayList,
      userStanding,
      poolInfo
    });
  } catch (error) {
    console.error('[Leaderboard API Error]', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve leaderboard data from database.'
    });
  }
});

module.exports = router;
