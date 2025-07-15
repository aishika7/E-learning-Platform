const User = require('../models/user.model');
const Course = require('../models/course.model');
const Enrollment = require('../models/enrollment.model');

exports.getAdminMetrics = async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });

  try {
    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalInstructors = await User.countDocuments({ role: 'instructor' });
    const totalCourses = await Course.countDocuments();
    const totalEnrollments = await Enrollment.countDocuments();

    res.json({ totalUsers, totalStudents, totalInstructors, totalCourses, totalEnrollments });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getInstructorMetrics = async (req, res) => {
  if (req.user.role !== 'instructor') return res.status(403).json({ message: 'Forbidden' });

  try {
    const courses = await Course.find({ createdBy: req.user.id });
    const courseIds = courses.map(c => c._id);

    const enrollments = await Enrollment.find({ course: { $in: courseIds } });

    // Group by course
    const metrics = courses.map(course => {
      const courseEnrollments = enrollments.filter(e => e.course.toString() === course._id.toString());
      const avgProgress = courseEnrollments.length
        ? courseEnrollments.reduce((sum, e) => sum + (e.progress?.percentage || 0), 0) / courseEnrollments.length
        : 0;

      return {
        courseTitle: course.title,
        enrollments: courseEnrollments.length,
        avgProgress: Math.round(avgProgress)
      };
    });

    res.json({ metrics });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
