const mongoose = require('mongoose');
const Giveaway = require('../models/Giveaway');
const Participation = require('../models/Participation');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const FraudEvent = require('../models/FraudEvent');
const AuditLog = require('../models/AuditLog');

/**
 * Atomic Join Flow
 * Endpoint: POST /api/participation/join
 * Body: { giveawayId, prizeId, deviceHash }
 */
exports.joinGiveaway = async (req, res) => {
  const { giveawayId, prizeId, deviceHash } = req.body;
  const user = req.user; // Verified from auth middleware
  const clientIp = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';

  // 1. Device Hash Validation
  if (!deviceHash || typeof deviceHash !== 'string' || deviceHash.length < 8) {
    return res.status(400).json({
      success: false,
      message: 'Valid hardware deviceHash is required for fraud prevention.'
    });
  }

  // 2. Fraud Signal Check (Check for device collision across distinct accounts within last 1 hour)
  try {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentDeviceHits = await Participation.distinct('userId', {
      deviceHash,
      createdAt: { $gte: oneHourAgo }
    });

    if (recentDeviceHits.length >= 3 && !recentDeviceHits.some(id => id.equals(user._id))) {
      // Log critical fraud event
      await FraudEvent.create({
        userId: user._id,
        customUserId: user.customUserId,
        deviceHash,
        ipAddress: clientIp,
        userAgent: req.headers['user-agent'] || '',
        eventType: 'DEVICE_COLLISION',
        riskScore: 85,
        severity: 'HIGH',
        metadata: { conflictingAccountsCount: recentDeviceHits.length, giveawayId }
      });

      return res.status(429).json({
        success: false,
        message: 'Security lockout: Device anomaly detected. Multiple accounts detected on this terminal.'
      });
    }
  } catch (err) {
    console.error('[Fraud Detection Warning]', err.message);
  }

  // 3. Query Authoritative Giveaway from DB (Disregard any client-sent prices/status)
  const giveaway = await Giveaway.findOne({
    $or: [{ giveawayId }, { slug: giveawayId }]
  });

  if (!giveaway) {
    return res.status(404).json({
      success: false,
      message: 'Giveaway not found.'
    });
  }

  // 4. Verify Active Status and Lifecycle Timing
  const now = new Date();
  if (giveaway.status !== 'ACTIVE') {
    return res.status(400).json({
      success: false,
      message: `Giveaway is not active (Current status: ${giveaway.status}).`
    });
  }

  if (now < giveaway.startAt) {
    return res.status(400).json({
      success: false,
      message: 'Giveaway has not started yet.'
    });
  }

  if (now > giveaway.endAt) {
    return res.status(400).json({
      success: false,
      message: 'Giveaway has concluded.'
    });
  }

  // 5. Match Authoritative Prize & Cost
  const prize = giveaway.prizes.find((p) => p.prizeId === prizeId) || giveaway.prizes[0];
  if (!prize) {
    return res.status(400).json({
      success: false,
      message: 'Specified prize not found in this giveaway pool.'
    });
  }

  const { currency, entryFee } = prize;

  // 6. Pre-Check Duplicate Join at Application Level (Secondary check before unique index)
  const existingJoin = await Participation.findOne({
    userId: user._id,
    giveawayId: giveaway.giveawayId
  });

  if (existingJoin) {
    return res.status(409).json({
      success: false,
      code: 'ALREADY_PARTICIPATING',
      message: "You're already participating in this giveaway.",
      ticketNumber: existingJoin.ticketNumber
    });
  }

  // 7. Validate Currency Balance against authoritative DB User
  const freshUser = await User.findById(user._id);
  const currentBalance = freshUser.balances[currency] || 0;

  if (currentBalance < entryFee) {
    const deficit = entryFee - currentBalance;
    await AuditLog.create({
      action: 'PARTICIPATION_FAILED',
      userId: user._id,
      customUserId: user.customUserId,
      giveawayId: giveaway.giveawayId,
      status: 'DENIED',
      reason: `Insufficient ${currency} balance (Deficit: ${deficit})`,
      ipAddress: clientIp,
      deviceHash
    });

    return res.status(400).json({
      success: false,
      code: 'INSUFFICIENT_BALANCE',
      message: `Insufficient ${currency} balance.`,
      currency,
      required: entryFee,
      available: currentBalance,
      deficit
    });
  }

  // 8. Atomic Execution (Session Transaction with graceful Standalone fallback)
  const session = await mongoose.startSession();
  let supportsTransactions = true;

  try {
    session.startTransaction();
  } catch (sessErr) {
    // If running in local standalone MongoDB without replica set
    supportsTransactions = false;
  }

  try {
    const balanceBefore = currentBalance;
    const balanceAfter = balanceBefore - entryFee;
    const ticketNumber = `TK-${Math.floor(100000 + Math.random() * 900000)}`;

    const opts = supportsTransactions ? { session } : {};

    // A. Atomic Balance Deduction with Guard condition
    const updateQuery = {
      _id: user._id,
      [`balances.${currency}`]: { $gte: entryFee }
    };

    const updatedUser = await User.findOneAndUpdate(
      updateQuery,
      { $inc: { [`balances.${currency}`]: -entryFee } },
      { new: true, ...opts }
    );

    if (!updatedUser) {
      throw new Error('Concurrent balance mutation detected. Insufficient funds.');
    }

    // B. Write Transaction Audit Record
    const [transaction] = await Transaction.create(
      [
        {
          userId: user._id,
          customUserId: user.customUserId,
          type: 'GIVEAWAY_ENTRY',
          currency,
          amount: entryFee,
          balanceBefore,
          balanceAfter,
          referenceId: giveaway.giveawayId,
          referenceModel: 'Giveaway',
          status: 'SUCCESS',
          metadata: { prizeId: prize.prizeId, prizeName: prize.name, ticketNumber }
        }
      ],
      opts
    );

    // C. Create Participation Record (Protected by compound index { userId: 1, giveawayId: 1 })
    const [participation] = await Participation.create(
      [
        {
          userId: user._id,
          customUserId: user.customUserId,
          giveawayId: giveaway.giveawayId,
          giveawayDocId: giveaway._id,
          prizeId: prize.prizeId,
          entryCurrency: currency,
          entryAmount: entryFee,
          deviceHash,
          ipAddress: clientIp,
          transactionId: transaction._id,
          ticketNumber,
          status: 'CONFIRMED'
        }
      ],
      opts
    );

    // D. Increment spots taken on Giveaway
    await Giveaway.findByIdAndUpdate(
      giveaway._id,
      { $inc: { spotsTaken: 1 } },
      opts
    );

    // Commit Transaction
    if (supportsTransactions) {
      await session.commitTransaction();
    }

    // Write Financial Audit Log
    await AuditLog.create({
      action: 'PARTICIPATION_SUCCESS',
      userId: user._id,
      customUserId: user.customUserId,
      giveawayId: giveaway.giveawayId,
      status: 'SUCCESS',
      ipAddress: clientIp,
      deviceHash,
      details: {
        ticketNumber,
        currency,
        deducted: entryFee,
        balanceAfter
      }
    });

    return res.status(201).json({
      success: true,
      message: 'Participation confirmed successfully.',
      data: {
        ticketNumber: participation.ticketNumber,
        giveawayId: giveaway.giveawayId,
        prize: prize.name,
        deducted: entryFee,
        currency,
        remainingBalance: balanceAfter,
        confirmedAt: participation.createdAt
      }
    });
  } catch (error) {
    if (supportsTransactions) {
      await session.abortTransaction();
    }

    // Catch MongoDB E11000 duplicate key error on compound index { userId, giveawayId }
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        code: 'ALREADY_PARTICIPATING',
        message: "You're already participating in this giveaway."
      });
    }

    console.error('[Participation Transaction Error]', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to complete participation transaction.'
    });
  } finally {
    session.endSession();
  }
};

/**
 * Get current user participation status for a giveaway
 * Endpoint: GET /api/participation/:id/my-status
 */
exports.getMyStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    const giveaway = await Giveaway.findOne({
      $or: [{ giveawayId: id }, { slug: id }]
    });

    if (!giveaway) {
      return res.status(404).json({
        success: false,
        message: 'Giveaway not found.'
      });
    }

    const participation = await Participation.findOne({
      userId: user._id,
      giveawayId: giveaway.giveawayId
    });

    return res.json({
      success: true,
      data: {
        hasJoined: !!participation,
        giveawayId: giveaway.giveawayId,
        ticketNumber: participation ? participation.ticketNumber : null,
        joinedAt: participation ? participation.createdAt : null
      }
    });
  } catch (error) {
    console.error('[Get My Status Error]', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve participation status.'
    });
  }
};
