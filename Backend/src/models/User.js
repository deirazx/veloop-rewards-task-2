const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    customUserId: {
      type: String,
      required: [true, 'customUserId is required'],
      unique: true,
      trim: true,
      index: true,
      example: 'VE10025'
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      default: ''
    },
    balances: {
      VES: {
        type: Number,
        default: 0,
        min: [0, 'VES balance cannot be negative']
      },
      SVES: {
        type: Number,
        default: 0,
        min: [0, 'SVES balance cannot be negative']
      },
      Tokens: {
        type: Number,
        default: 0,
        min: [0, 'Tokens balance cannot be negative']
      }
    },
    tier: {
      type: String,
      enum: ['Standard', 'Silver', 'Gold', 'Platinum Elite'],
      default: 'Platinum Elite'
    },
    isKycVerified: {
      type: Boolean,
      default: true
    },
    isSuspended: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('User', userSchema);
