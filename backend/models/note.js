const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  note: String
});

module.exports = mongoose.model('Note', noteSchema);
