const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendVeriEmail, sendResetEmail } = require('../utils/mailer');
const { generateOTP, generateToken, hashValue, compareHash } = require('../utils/tokens');

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: 'Username already taken' });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const code = generateOTP();
    const codeHash = await hashValue(code);
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      isVerified: false,
      emailVeriCodeHash: codeHash,
      emailVeriCodeExpires: expires,
    });

    await newUser.save();
    await sendVeriEmail(email, code);

    res.status(201).json({ message: 'User created. Verification code sent to email.' });

  } catch (err) {
    console.error('Register error:', err.stack || err.message);
    res.status(500).json({ message: 'Server error' });
  }
}; 

exports.verifyEmail = async (req, res) => {
  try {
    const { email, code } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: 'Invalid email or code' });
    if (user.isVerified) return res.json({ message: 'Already verified' });

    if (!user.emailVeriCodeHash || !user.emailVeriCodeExpires || user.emailVeriCodeExpires < new Date()) {
      return res.status(400).json({ message: 'Verification code expired. Please resend.' });
    }

    const ok = await compareHash(code, user.emailVeriCodeHash);
    if (!ok) return res.status(400).json({ message: 'Invalid verification code' });

    user.isVerified = true;
    user.emailVeriCodeHash = undefined;
    user.emailVeriCodeExpires = undefined;
    await user.save();

    res.json({ message: 'Email verified successfully' });

  } catch (err) {
    console.error('Verify error:', err.stack || err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.resendCode = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (user) {
      const code = generateOTP();
      user.emailVeriCodeHash = await hashValue(code);
      user.emailVeriCodeExpires = new Date(Date.now() + 10 * 60 * 1000);
      await user.save();
      await sendVeriEmail(email, code);
    }

    res.json({ message: 'If the email exists, a code has been sent.' });

  } catch (err) {
    console.error('Resend error:', err.stack || err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { loginInput, password } = req.body;

    const user = await User.findOne({
      $or: [{ username: loginInput }, { email: loginInput }]
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid username/email' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    if (!user.isVerified) {
      return res.status(403).json({ message: 'Email not verified. Please verify or request a new code.' });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        username: user.username,
        email: user.email,
      }
    });

  } catch (err) {
    console.error('Login error:', err.stack || err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (user) {
      const token = generateToken();
      user.passwordResetTokenHash = await hashValue(token);
      user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
      await user.save();

      const link = `${process.env.FRONTEND_URL}/reset-password?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`;
      await sendResetEmail(email, link);
    }

    res.json({ message: 'If the email exists, a reset link has been sent.' });

  } catch (err) {
    console.error('Forgot password error:', err.stack || err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, token, newPassword } = req.body;
    const user = await User.findOne({ email });

    if (
      !user ||
      !user.passwordResetTokenHash ||
      !user.passwordResetExpires ||
      user.passwordResetExpires < new Date()
    ) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    const ok = await compareHash(token, user.passwordResetTokenHash);
    if (!ok) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.passwordResetTokenHash = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.json({ message: 'Password reset successfully' });

  } catch (err) {
    console.error('Reset password error:', err.stack || err.message);
    res.status(500).json({ message: 'Server error' });
  }
};
