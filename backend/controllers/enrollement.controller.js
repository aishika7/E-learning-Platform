const Enrollment = require('../models/enrollment.model');

exports.enrollInCourse = async (req, res) => {
  const studentId = req.user.id;
  const { courseId } = req.body;

  try {
    // Check if already enrolled
    const exists = await Enrollment.findOne({ student: studentId, course: courseId });
    if (exists) {
      return res.status(400).json({ message: 'Already enrolled' });
    }

    const enrollment = new Enrollment({ student: studentId, course: courseId });
    await enrollment.save();

    res.status(201).json({ message: 'Enrolled successfully', enrollment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getStudentEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user.id }).populate('course');
    res.json(enrollments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateProgress = async (req, res) => {
  const { courseId } = req.params;
  const { lessonTitle } = req.body;

  try {
    const enrollment = await Enrollment.findOne({
      course: courseId,
      student: req.user.id
    });

    if (!enrollment) return res.status(404).json({ message: 'Enrollment not found' });

    if (!enrollment.progress.completedLessons.includes(lessonTitle)) {
      enrollment.progress.completedLessons.push(lessonTitle);
    }

    const totalLessons = 10;
    const completed = enrollment.progress.completedLessons.length;
    enrollment.progress.percentage = Math.round((completed / totalLessons) * 100);

    await enrollment.save();
    res.json({ message: 'Progress updated', progress: enrollment.progress });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
