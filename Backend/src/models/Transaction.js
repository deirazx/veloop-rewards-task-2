const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
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
    type: {
      type: String,
      enum: ['GIVEAWAY_ENTRY', 'REFUND', 'REWARD_EARNED', 'MANUAL_ADJUSTMENT'],
      default: 'GIVEAWAY_ENTRY'
    },
    currency: {
      type: String,
      enum: ['VES', 'SVES', 'Tokens'],
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    balanceBefore: {
      type: Number,
      required: true
    },
    balanceAfter: {
      type: Number,
      required: true
    },
    referenceId: {
      type: String,
      default: ''
    },
    referenceModel: {
      type: String,
      default: 'Giveaway'
    },
    status: {
      type: String,
      enum: ['PENDING', 'SUCCESS', 'FAILED', 'REVERSED'],
      default: 'SUCCESS',
      index: true
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Transaction', transactionSchema);
