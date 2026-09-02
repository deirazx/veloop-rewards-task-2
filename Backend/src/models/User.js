const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    customUserId: {
      type: String,
      unique: true,
      trim: true,
      index: true
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
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Enter a valid email address']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false // Do not return password by default in queries
    },
    phone: {
      type: String,
      default: ''
    },
    // Seed default starting balances as specified: VES: 1000, SVES: 1500, Tokens: 3000
    balances: {
      VES: {
        type: Number,
        default: 1000,
        min: [0, 'VES balance cannot be negative']
      },
      SVES: {
        type: Number,
        default: 1500,
        min: [0, 'SVES balance cannot be negative']
      },
      Tokens: {
        type: Number,
        default: 3000,
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

// Pre-save hook: Auto-generate customUserId & Hash password
userSchema.pre('save', async function (next) {
  // 1. Auto-generate unique customUserId (e.g. VE10025) if not already set
  if (!this.customUserId) {
    let uniqueFound = false;
    while (!uniqueFound) {
      const randomNum = Math.floor(10000 + Math.random() * 90000); // 5 digits
      const candidateId = `VE${randomNum}`;
      const existing = await mongoose.models.User.findOne({ customUserId: candidateId });
      if (!existing) {
        this.customUserId = candidateId;
        uniqueFound = true;
      }
    }
  }

  // 2. Hash password if modified or newly created
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to verify password on login
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
