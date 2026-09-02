const mongoose = require('mongoose');

const physicalShippingSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required for physical dispatch'],
      trim: true
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required for courier delivery OTP'],
      trim: true
    },
    address: {
      type: String,
      required: [true, 'Street address is required'],
      trim: true
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true
    },
    pinCode: {
      type: String,
      required: [true, 'Postal PIN code is required'],
      trim: true,
      match: [/^[0-9]{6}$/, 'Enter a valid 6-digit PIN code']
    }
  },
  { _id: false }
);

const giftCardSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Recipient email address is required for digital delivery'],
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Enter a valid email address']
    }
  },
  { _id: false }
);

const claimSchema = new mongoose.Schema(
  {
    winnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Winner',
      required: true,
      unique: true, // One claim per winner record
      index: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    customUserId: {
      type: String,
      required: true
    },
    giveawayId: {
      type: String,
      required: true
    },
    claimType: {
      type: String,
      enum: ['PHYSICAL', 'GIFT_CARD'],
      required: true
    },
    // Distinct Payload Isolation based on claimType
    physicalShipping: {
      type: physicalShippingSchema,
      required: function () {
        return this.claimType === 'PHYSICAL';
      }
    },
    giftCardDelivery: {
      type: giftCardSchema,
      required: function () {
        return this.claimType === 'GIFT_CARD';
      }
    },
    status: {
      type: String,
      enum: ['SUBMITTED', 'VERIFIED', 'DISPATCHED', 'COMPLETED', 'REJECTED'],
      default: 'SUBMITTED',
      index: true
    },
    dispatchDetails: {
      courierName: { type: String, default: '' },
      trackingNumber: { type: String, default: '' },
      digitalVoucherPin: { type: String, default: '' },
      dispatchedAt: { type: Date }
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Claim', claimSchema);
