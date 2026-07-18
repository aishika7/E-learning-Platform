// controllers/dashboard.controller.js
const User = require('../models/user.model');
const Course = require('../models/course.model');
const Enrollment = require('../models/enrollment.model');
const { createSuccess, createError } = require('../utils/response.utils');

// ─── Admin Dashboard ──────────────────────────────────────────────────────────

exports.getAdminMetrics = async (req, res, next) => {
  try {
    const [totalUsers, totalStudents, totalInstructors, totalCourses, totalEnrollments, recentUsers] =
      await Promise.all([
        User.countDocuments(),
        User.countDocuments({ role: 'student' }),
        User.countDocuments({ role: 'instructor' }),
        Course.countDocuments(),
        Enrollment.countDocuments(),
        User.find().sort({ createdAt: -1 }).limit(5).select('name email role createdAt avatar'),
      ]);

    res.json(
      createSuccess({
        metrics: { totalUsers, totalStudents, totalInstructors, totalCourses, totalEnrollments },
        recentUsers,
      })
    );
  } catch (err) {
    next(err);
  }
};

// ─── Instructor Dashboard ─────────────────────────────────────────────────────

exports.getInstructorMetrics = async (req, res, next) => {
  try {
    const courses = await Course.find({ createdBy: req.user.id }).lean();
    const courseIds = courses.map((c) => c._id);

    const enrollments = await Enrollment.find({ course: { $in: courseIds } });

    const metrics = courses.map((course) => {
      const courseEnrollments = enrollments.filter(
        (e) => e.course.toString() === course._id.toString()
      );
      const avgProgress =
        courseEnrollments.length
          ? courseEnrollments.reduce((sum, e) => sum + (e.progress?.percentage || 0), 0) /
            courseEnrollments.length
          : 0;

      return {
        courseId: course._id,
        courseTitle: course.title,
        thumbnail: course.thumbnail,
        isPublished: course.isPublished,
        enrollments: courseEnrollments.length,
        avgProgress: Math.round(avgProgress),
        completedCount: courseEnrollments.filter((e) => e.progress?.percentage === 100).length,
      };
    });

    const totalStudents = new Set(enrollments.map((e) => e.student.toString())).size;
    const totalCourses = courses.length;
    const publishedCourses = courses.filter((c) => c.isPublished).length;

    res.json(
      createSuccess({
        summary: { totalCourses, publishedCourses, totalStudents },
        courseMetrics: metrics,
      })
    );
  } catch (err) {
    next(err);
  }
};

// ─── Student Dashboard ────────────────────────────────────────────────────────

exports.getStudentMetrics = async (req, res, next) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user.id })
      .populate('course', 'title thumbnail category level duration')
      .sort({ updatedAt: -1 });

    const totalEnrolled = enrollments.length;
    const completed = enrollments.filter((e) => e.progress?.percentage === 100).length;
    const avgProgress =
      totalEnrolled > 0
        ? Math.round(
            enrollments.reduce((sum, e) => sum + (e.progress?.percentage || 0), 0) / totalEnrolled
          )
        : 0;

    const recentCourses = enrollments.slice(0, 3).map((e) => ({
      enrollmentId: e._id,
      course: e.course,
      progress: e.progress,
      enrolledAt: e.createdAt,
    }));

    res.json(
      createSuccess({
        metrics: { totalEnrolled, completed, avgProgress },
        recentCourses,
      })
    );
  } catch (err) {
    next(err);
  }
};
