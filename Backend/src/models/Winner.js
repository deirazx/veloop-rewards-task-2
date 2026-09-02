const mongoose = require('mongoose');

const winnerSchema = new mongoose.Schema(
  {
    giveawayId: {
      type: String,
      required: true,
      index: true
    },
    giveawayDocId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Giveaway',
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    customUserId: {
      type: String,
      required: true,
      index: true
    },
    maskedUserId: {
      type: String,
      required: true,
      example: 'VE****25'
    },
    ticketNumber: {
      type: String,
      required: true
    },
    prizeId: {
      type: String,
      required: true
    },
    prizeName: {
      type: String,
      required: true
    },
    prizeType: {
      type: String,
      enum: ['PHYSICAL', 'GIFT_CARD'],
      required: true
    },
    drawTimestamp: {
      type: Date,
      default: Date.now
    },
    claimStatus: {
      type: String,
      enum: ['UNCLAIMED', 'CLAIMED', 'EXPIRED'],
      default: 'UNCLAIMED',
      index: true
    },
    provableSeed: {
      type: String,
      default: () => '0x' + Math.random().toString(16).substr(2, 16)
    }
  },
  {
    timestamps: true
  }
);

// Compound index to prevent picking duplicate winners for the same prize/giveaway
winnerSchema.index({ giveawayId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('Winner', winnerSchema);
