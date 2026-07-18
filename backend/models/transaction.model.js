// models/transaction.model.js
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    amount: { type: Number, required: true },           // in INR (rupees)
    currency: { type: String, default: 'INR' },
    orderId: { type: String, default: '' },             // Razorpay order ID or demo ID
    paymentId: { type: String, default: '' },           // Razorpay payment ID or demo ID
    status: {
      type: String,
      enum: ['pending', 'success', 'failed', 'demo'],
      default: 'demo',
    },
  },
  { timestamps: true }
);

transactionSchema.index({ student: 1 });
transactionSchema.index({ course: 1 });

module.exports = mongoose.model('Transaction', transactionSchema);
