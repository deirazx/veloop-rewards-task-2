const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      enum: [
        'PARTICIPATION_ATTEMPT',
        'PARTICIPATION_SUCCESS',
        'PARTICIPATION_FAILED',
        'CLAIM_ATTEMPT',
        'CLAIM_SUCCESS',
        'CLAIM_FAILED',
        'BALANCE_DEDUCTION',
        'WINNER_DECLARATION'
      ],
      required: true,
      index: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true
    },
    customUserId: {
      type: String,
      default: ''
    },
    giveawayId: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['SUCCESS', 'DENIED', 'ERROR'],
      required: true
    },
    reason: {
      type: String,
      default: ''
    },
    ipAddress: {
      type: String,
      default: ''
    },
    deviceHash: {
      type: String,
      default: ''
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('AuditLog', auditLogSchema);
