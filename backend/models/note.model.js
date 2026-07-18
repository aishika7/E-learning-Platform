// models/note.model.js
const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema(
  {
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    lessonId: { type: mongoose.Schema.Types.ObjectId, default: null }, // optional per-lesson note
    content: { type: String, default: '' },
  },
  { timestamps: true }
);

// One note per student per course (upsert-friendly index)
noteSchema.index({ studentId: 1, courseId: 1 });

module.exports = mongoose.model('Note', noteSchema);
