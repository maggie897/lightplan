const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  // Unique username for login
  username: {
    type: String,
    required: true,
    unique: true
  },

  // Unique email for login, verification and reset password
  email: {
    type: String,
    required: true,
    unique: true
  },

  // Hashed password
  password: {
    type: String,
    required: true
  },

  // Has this user's email been verified?
  isVerified: {
    type: Boolean,
    default: false
  },

  // Email verification code (hashed) + expiration
  emailVeriCodeHash: {
    type: String
  },

  emailVeriCodeExpires: {
    type: Date
  },

  // Password reset token (hashed) + expiration
  passwordResetTokenHash: {
    type: String
  },

  passwordResetExpires: {
    type: Date
  }

}, {
  timestamps: true  // Adds createdAt and updatedAt fields
});

module.exports = mongoose.model('User', UserSchema);