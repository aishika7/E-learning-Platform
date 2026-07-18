// controllers/auth.controller.js
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { createSuccess, createError } = require('../utils/response.utils');
const { generateResetToken, hashToken, getTokenExpiry } = require('../utils/token.utils');
const { sendPasswordResetEmail } = require('../config/email');

// ─── Helpers ──────────────────────────────────────────────────────────────────

const generateToken = (user) =>
  jwt.sign(
    { id: user._id, role: user.role, name: user.name, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '2d' }
  );

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  avatar: user.avatar,
  bio: user.bio,
  createdAt: user.createdAt,
});

// ─── Register ─────────────────────────────────────────────────────────────────

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // Only allow student or instructor at registration — admin created via seed/DB
    const allowedRoles = ['student', 'instructor'];
    const userRole = allowedRoles.includes(role) ? role : 'student';

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json(createError('An account with this email already exists', 409));
    }

    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email: email.toLowerCase(), password: hashed, role: userRole });

    const token = generateToken(user);
    res.status(201).json(createSuccess({ token, user: sanitizeUser(user) }, 'Account created successfully'));
  } catch (err) {
    next(err);
  }
};

// ─── Login ────────────────────────────────────────────────────────────────────

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json(createError('Invalid email or password', 401));
    }

    if (!user.isActive) {
      return res.status(403).json(createError('Account is deactivated. Contact support.', 403));
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json(createError('Invalid email or password', 401));
    }

    const token = generateToken(user);
    res.json(createSuccess({ token, user: sanitizeUser(user) }, 'Login successful'));
  } catch (err) {
    next(err);
  }
};

// ─── Get Current User ─────────────────────────────────────────────────────────

exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json(createError('User not found', 404));
    res.json(createSuccess(sanitizeUser(user)));
  } catch (err) {
    next(err);
  }
};

// ─── Update Profile ───────────────────────────────────────────────────────────

exports.updateProfile = async (req, res, next) => {
  try {
    const { name, bio, avatar } = req.body;
    const updates = {};
    if (name !== undefined) updates.name = name.trim();
    if (bio !== undefined) updates.bio = bio;
    if (avatar !== undefined) updates.avatar = avatar;

    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true, runValidators: true });
    if (!user) return res.status(404).json(createError('User not found', 404));

    res.json(createSuccess(sanitizeUser(user), 'Profile updated successfully'));
  } catch (err) {
    next(err);
  }
};

// ─── Change Password ──────────────────────────────────────────────────────────

exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id).select('+password');
    if (!user) return res.status(404).json(createError('User not found', 404));

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json(createError('Current password is incorrect', 400));
    }

    if (newPassword.length < 8) {
      return res.status(400).json(createError('New password must be at least 8 characters', 400));
    }

    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();

    res.json(createSuccess(null, 'Password changed successfully'));
  } catch (err) {
    next(err);
  }
};

// ─── Forgot Password ──────────────────────────────────────────────────────────

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });

    // Always respond with success (don't reveal if email exists — security best practice)
    if (!user) {
      return res.json(createSuccess(null, 'If this email exists, a reset link has been sent.'));
    }

    const resetToken = generateResetToken();
    const hashedToken = hashToken(resetToken);

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = getTokenExpiry(10); // 10 minutes
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.CLIENT_URL}/auth/reset-password?token=${resetToken}`;

    await sendPasswordResetEmail(user.email, resetUrl);

    // In development, also log the URL so it can be tested without real email
    if (process.env.NODE_ENV !== 'production') {
      console.log(`\n[DEV] Password reset URL for ${user.email}:\n${resetUrl}\n`);
    }

    res.json(createSuccess(null, 'If this email exists, a reset link has been sent.'));
  } catch (err) {
    next(err);
  }
};

// ─── Reset Password ───────────────────────────────────────────────────────────

exports.resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 8) {
      return res.status(400).json(createError('Password must be at least 8 characters', 400));
    }

    const hashedToken = hashToken(token);
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    }).select('+resetPasswordToken +resetPasswordExpires');

    if (!user) {
      return res.status(400).json(createError('Invalid or expired reset token', 400));
    }

    user.password = await bcrypt.hash(newPassword, 12);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save({ validateBeforeSave: false });

    res.json(createSuccess(null, 'Password reset successfully. You can now log in.'));
  } catch (err) {
    next(err);
  }
};
