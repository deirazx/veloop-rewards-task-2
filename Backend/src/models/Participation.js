const mongoose = require('mongoose');

const participationSchema = new mongoose.Schema(
  {
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
    giveawayId: {
      type: String, // String reference to Giveaway.giveawayId
      required: true,
      index: true
    },
    giveawayDocId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Giveaway',
      required: true
    },
    prizeId: {
      type: String,
      required: true
    },
    entryCurrency: {
      type: String,
      enum: ['VES', 'SVES', 'Tokens'],
      required: true
    },
    entryAmount: {
      type: Number,
      required: true,
      min: 0
    },
    deviceHash: {
      type: String,
      required: true,
      index: true
    },
    ipAddress: {
      type: String,
      default: ''
    },
    transactionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Transaction',
      required: true
    },
    ticketNumber: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    status: {
      type: String,
      enum: ['CONFIRMED', 'CANCELLED', 'REFUNDED'],
      default: 'CONFIRMED'
    }
  },
  {
    timestamps: true
  }
);

// CRITICAL: Compound unique index to strictly block duplicate entries at the database engine layer
participationSchema.index({ userId: 1, giveawayId: 1 }, { unique: true });

module.exports = mongoose.model('Participation', participationSchema);
