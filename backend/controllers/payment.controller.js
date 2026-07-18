// controllers/payment.controller.js — DEMO MODE
const crypto = require('crypto');
const Enrollment = require('../models/enrollment.model');
const Transaction = require('../models/transaction.model');
const Course = require('../models/course.model');
const { createSuccess, createError } = require('../utils/response.utils');

// ─── Create Demo Order ────────────────────────────────────────────────────────

exports.createOrder = async (req, res, next) => {
  try {
    const { courseId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json(createError('Course not found', 404));
    if (!course.isPublished) return res.status(400).json(createError('Course not available', 400));

    const isDemoMode = process.env.DEMO_PAYMENT_MODE === 'true';

    if (isDemoMode) {
      // Return a mock order — no real Razorpay call
      const demoOrder = {
        id: `demo_order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        amount: course.price * 100,  // paisa
        currency: 'INR',
        courseId: course._id,
        courseTitle: course.title,
        isDemo: true,
      };
      return res.json(createSuccess(demoOrder, 'Demo order created'));
    }

    // Real Razorpay flow (when DEMO_PAYMENT_MODE=false)
    const Razorpay = require('razorpay');
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
    });
    const order = await razorpay.orders.create({
      amount: course.price * 100, // Convert to paise
      currency: 'INR',
      receipt: `rcpt_${courseId}_${Date.now()}`,
    });
    res.json(createSuccess(order));
  } catch (err) {
    next(err);
  }
};

// ─── Verify Payment & Enroll ──────────────────────────────────────────────────

exports.verifyPayment = async (req, res, next) => {
  try {
    const { orderId, paymentId, signature, courseId } = req.body;
    const isDemoMode = process.env.DEMO_PAYMENT_MODE === 'true';

    // Demo mode — skip signature verification
    if (!isDemoMode) {
      const generated = crypto
        .createHmac('sha256', process.env.RAZORPAY_SECRET)
        .update(`${orderId}|${paymentId}`)
        .digest('hex');

      if (generated !== signature) {
        return res.status(400).json(createError('Payment verification failed — invalid signature', 400));
      }
    }

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json(createError('Course not found', 404));

    // Check if already enrolled
    const existing = await Enrollment.findOne({ student: req.user.id, course: courseId });
    if (existing) return res.status(409).json(createError('Already enrolled in this course', 409));

    // Create enrollment
    const enrollment = await Enrollment.create({
      student: req.user.id,
      course: courseId,
      paymentId: paymentId || `demo_pay_${Date.now()}`,
      paymentStatus: isDemoMode ? 'demo' : 'paid',
    });

    // Record transaction
    await Transaction.create({
      student: req.user.id,
      course: courseId,
      amount: course.price,
      orderId: orderId || `demo_order_${Date.now()}`,
      paymentId: paymentId || `demo_pay_${Date.now()}`,
      status: isDemoMode ? 'demo' : 'success',
    });

    // Increment enrollment count
    await Course.findByIdAndUpdate(courseId, { $inc: { enrollmentCount: 1 } });

    res.json(createSuccess(enrollment, isDemoMode ? 'Demo payment accepted — enrolled!' : 'Payment verified — enrolled!'));
  } catch (err) {
    next(err);
  }
};
