const mongoose = require('mongoose');

const fraudEventSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true
    },
    customUserId: {
      type: String,
      default: ''
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
    userAgent: {
      type: String,
      default: ''
    },
    eventType: {
      type: String,
      enum: ['DEVICE_COLLISION', 'RAPID_REQUESTS', 'BALANCE_TAMPERING', 'UNAUTHORIZED_CLAIM', 'MULTIPLE_ACCOUNTS'],
      required: true
    },
    riskScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    severity: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
      default: 'MEDIUM'
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

module.exports = mongoose.model('FraudEvent', fraudEventSchema);
