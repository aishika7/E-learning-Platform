const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  progress: {
    completedLessons: [String], 
    percentage: {
      type: Number,
      default: 0
    }
  },
  enrolledAt: {
    type: Date,
    default: Date.now
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  enrolledAt: { type: Date, default: Date.now },
  progress: {
    completedLessons: [String],
    percentage: { type: Number, default: 0 }
  }
});

module.exports = mongoose.model('Enrollment', enrollmentSchema);
