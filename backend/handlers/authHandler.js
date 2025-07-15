const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../db/user');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const user = new User({ name, email, password: hashedPassword, otp });
    await user.save();

    await transporter.sendMail({
      to: email,
      subject: 'Your OTP Code',
      text: `Use this code to verify your account: ${otp}`,
    });

    res.status(200).json({ message: 'User registered. Check email for OTP.' });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed' });
  }
};

exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email });
  if (user && user.otp === otp) {
    user.isVerified = true;
    user.otp = null;
    await user.save();
    res.status(200).json({ message: 'OTP verified' });
  } else {
    res.status(400).json({ error: 'Invalid OTP' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !user.isVerified) return res.status(403).json({ error: 'User not verified' });
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ error: 'Incorrect credentials' });
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });
  res.status(200).json({ token, role: user.role });
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: 'Email not found' });
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.otp = otp;
  await user.save();
  await transporter.sendMail({
    to: email,
    subject: 'Password Reset OTP',
    text: `Use this code to reset your password: ${otp}`,
  });
  res.status(200).json({ message: 'OTP sent for password reset' });
};

exports.resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  const user = await User.findOne({ email });
  if (user && user.otp === otp) {
    user.password = await bcrypt.hash(newPassword, 10);
    user.otp = null;
    await user.save();
    res.status(200).json({ message: 'Password reset successfully' });
  } else {
    res.status(400).json({ error: 'Invalid OTP' });
  }
};