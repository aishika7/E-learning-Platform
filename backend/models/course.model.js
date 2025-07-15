const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  thumbnail: String,
  level: String,
  category: String,
  duration: String,
  language: String,
  price: Number,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  modules: [
    {
      title: String,
      lessons: [String]
    }
  ]
});

module.exports = mongoose.model('Course', courseSchema);
