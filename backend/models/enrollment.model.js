// models/enrollment.model.js — FIXED: removed duplicate field declarations
const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    paymentId: { type: String, default: null },       // Razorpay payment ID (demo)
    paymentStatus: {
      type: String,
      enum: ['free', 'paid', 'demo'],
      default: 'free',
    },
    progress: {
      completedLessons: [{ type: mongoose.Schema.Types.ObjectId }], // lesson _ids
      percentage: { type: Number, default: 0 },
      lastAccessedLesson: { type: mongoose.Schema.Types.ObjectId, default: null },
      completedAt: { type: Date, default: null },
    },
  },
  { timestamps: true }
);

// Prevent duplicate enrollments
enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });

module.exports = mongoose.model('Enrollment', enrollmentSchema);
