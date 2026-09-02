const Winner = require('../models/Winner');
const Claim = require('../models/Claim');
const AuditLog = require('../models/AuditLog');

/**
 * Claim Prize Flow
 * Endpoint: POST /api/claim/:id/claim
 * Param :id can be giveawayId or winnerId
 */
exports.submitClaim = async (req, res) => {
  const { id } = req.params;
  const user = req.user; // Verified from auth middleware
  const { claimType, physicalShipping, giftCardDelivery } = req.body;
  const clientIp = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';

  try {
    // 1. Locate the Winner Record
    const winner = await Winner.findOne({
      $or: [
        { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null },
        { giveawayId: id, customUserId: user.customUserId }
      ]
    });

    if (!winner) {
      return res.status(404).json({
        success: false,
        message: 'No eligible winning ticket found for this event.'
      });
    }

    // 2. Strict Identity Verification: Authenticate that req.user.customUserId === winner.customUserId
    if (user.customUserId !== winner.customUserId) {
      await AuditLog.create({
        action: 'CLAIM_FAILED',
        userId: user._id,
        customUserId: user.customUserId,
        giveawayId: winner.giveawayId,
        status: 'DENIED',
        reason: `Unauthorized claim attempt. User ${user.customUserId} tried to claim prize for winner ${winner.customUserId}`,
        ipAddress: clientIp
      });

      return res.status(403).json({
        success: false,
        message: 'Forbidden: You are not the registered winner of this ticket.'
      });
    }

    // 3. Check for Duplicate Claim Submissions
    if (winner.claimStatus === 'CLAIMED') {
      return res.status(409).json({
        success: false,
        message: 'This prize has already been claimed and processed.'
      });
    }

    // 4. Validate & Isolate Payload Based on Prize Type
    let claimData = {
      winnerId: winner._id,
      userId: user._id,
      customUserId: user.customUserId,
      giveawayId: winner.giveawayId,
      claimType: winner.prizeType,
      status: 'SUBMITTED'
    };

    if (winner.prizeType === 'PHYSICAL') {
      if (!physicalShipping) {
        return res.status(400).json({
          success: false,
          message: 'Physical shipping details are required for this prize.'
        });
      }

      const { fullName, phone, address, city, state, pinCode } = physicalShipping;
      if (!fullName || !phone || !address || !city || !state || !pinCode) {
        return res.status(400).json({
          success: false,
          message: 'Physical claim requires Full Name, Phone, Address, City, State, and 6-digit PIN code.'
        });
      }

      if (!/^[0-9]{6}$/.test(String(pinCode).trim())) {
        return res.status(400).json({
          success: false,
          message: 'Invalid 6-digit PIN code format.'
        });
      }

      claimData.physicalShipping = {
        fullName: fullName.trim(),
        phone: phone.trim(),
        address: address.trim(),
        city: city.trim(),
        state: state.trim(),
        pinCode: String(pinCode).trim()
      };
    } else if (winner.prizeType === 'GIFT_CARD') {
      if (!giftCardDelivery || !giftCardDelivery.email) {
        return res.status(400).json({
          success: false,
          message: 'Recipient email address is strictly required for digital voucher dispatch.'
        });
      }

      const email = giftCardDelivery.email.trim().toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid recipient email address.'
        });
      }

      // Strictly isolate email; omit any shipping inputs
      claimData.giftCardDelivery = { email };
    }

    // 5. Store Claim Record & Update Winner Status Atomically
    const claim = await Claim.create(claimData);

    winner.claimStatus = 'CLAIMED';
    await winner.save();

    // 6. Audit Trail
    await AuditLog.create({
      action: 'CLAIM_SUCCESS',
      userId: user._id,
      customUserId: user.customUserId,
      giveawayId: winner.giveawayId,
      status: 'SUCCESS',
      ipAddress: clientIp,
      details: {
        claimId: claim._id,
        prizeType: winner.prizeType,
        prizeName: winner.prizeName
      }
    });

    return res.status(201).json({
      success: true,
      message: `${winner.prizeType === 'PHYSICAL' ? 'Physical dispatch order' : 'Digital voucher request'} confirmed successfully.`,
      data: {
        claimId: claim._id,
        prize: winner.prizeName,
        prizeType: winner.prizeType,
        status: claim.status,
        submittedAt: claim.createdAt
      }
    });
  } catch (error) {
    console.error('[Submit Claim Error]', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error while processing prize claim.'
    });
  }
};
