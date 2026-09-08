const mongoose = require('mongoose');

const prizeSchema = new mongoose.Schema(
  {
    prizeId: {
      type: String,
      required: true,
      trim: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      enum: ['PHYSICAL', 'GIFT_CARD'],
      required: true
    },
    currency: {
      type: String,
      enum: ['VES', 'SVES', 'Tokens', 'VEs', 'SVEs'],
      required: true
    },
    entryFee: {
      type: Number,
      required: true,
      min: 0
    },
    winnerCount: {
      type: Number,
      default: 1,
      min: 1
    },
    retailPrice: {
      type: String,
      default: ''
    },
    image: {
      type: String,
      default: ''
    }
  },
  { _id: false }
);

const giveawaySchema = new mongoose.Schema(
  {
    giveawayId: {
      type: String,
      required: [true, 'giveawayId is required'],
      unique: true,
      trim: true,
      index: true
    },
    title: {
      type: String,
      required: [true, 'Giveaway title is required'],
      trim: true
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      trim: true,
      index: true
    },
    status: {
      type: String,
      enum: ['UPCOMING', 'ACTIVE', 'ENDED', 'ARCHIVED'],
      default: 'ACTIVE',
      index: true
    },
    startAt: {
      type: Date,
      required: true,
      default: Date.now
    },
    endAt: {
      type: Date,
      required: true,
      index: true
    },
    prizes: {
      type: [prizeSchema],
      required: true,
      validate: [val => val.length > 0, 'At least one prize must be configured']
    },
    entryFee: {
      type: Number,
      default: 0
    },
    currency: {
      type: String,
      default: 'VEs'
    },
    retailPrice: {
      type: String,
      default: ''
    },
    image: {
      type: String,
      default: ''
    },
    spotsTaken: {
      type: Number,
      default: 0
    },
    currentEntries: {
      type: Number,
      default: 0
    },
    totalSpots: {
      type: Number,
      default: 1000
    },
    maxEntries: {
      type: Number,
      default: 1000
    },
    participantsCount: {
      type: Number,
      default: 0
    },
    category: {
      type: String,
      default: 'Premium Rewards'
    },
    description: {
      type: String,
      default: ''
    },
    terms: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true
  }
);

// Virtual to determine if currently active by time
giveawaySchema.virtual('isCurrentlyActive').get(function () {
  const now = new Date();
  return this.status === 'ACTIVE' && now >= this.startAt && now <= this.endAt;
});

module.exports = mongoose.model('Giveaway', giveawaySchema);
