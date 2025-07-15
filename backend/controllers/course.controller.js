const Course = require('../models/course.model');

exports.addCourse = async (req, res) => {
  try {
    const course = new Course({ ...req.body, createdBy: req.user.id });
    await course.save();
    res.status(201).json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getCourses = async (req, res) => {
  try {
    let courses;
    if (req.user.role === 'admin') {
      courses = await Course.find();
    } else if (req.user.role === 'instructor') {
      courses = await Course.find({ createdBy: req.user.id });
    } else {
      // Student – for now just send all (until enrollment is implemented)
      courses = await Course.find();
    }
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
