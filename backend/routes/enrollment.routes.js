const express = require('express');
const router = express.Router();
const { enrollInCourse, getStudentEnrollments } = require('../controllers/enrollment.controller');
const auth = require('../middlewares/auth.middleware');
const { updateProgress } = require('../controllers/enrollment.controller');

router.put('/progress/:courseId', auth, updateProgress);
router.post('/', auth, enrollInCourse);
router.get('/', auth, getStudentEnrollments);

module.exports = router;
const enrollment = require('../models/enrollment.model');
const course = require('../models/course.model');
const authMiddleware = require('../middlewares/auth.middleware');
const crypto = require('crypto');
const Razorpay = require('razorpay');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

router.post('/verify', authMiddleware, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, courseId } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Payment verification failed!" });
    }

    const already = await Enrollment.findOne({ user: req.user._id, course: courseId });
    if (already) {
      return res.status(409).json({ message: "Already enrolled in this course." });
    }

    const newEnrollment = new Enrollment({
      user: req.user._id,
      course: courseId
    });

    await newEnrollment.save();
    res.json({ message: "Payment verified & enrolled!" });
  } catch (err) {
    console.error("Enrollment Error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;