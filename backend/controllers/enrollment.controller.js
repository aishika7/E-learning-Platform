// controllers/enrollment.controller.js (RENAMED from enrollement.controller.js - typo fixed)
const Enrollment = require('../models/enrollment.model');
const Course = require('../models/course.model');
const { createSuccess, createError } = require('../utils/response.utils');

// ─── Enroll in Free Course ────────────────────────────────────────────────────

exports.enrollInCourse = async (req, res, next) => {
  try {
    const { courseId } = req.body;
    const studentId = req.user.id;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json(createError('Course not found', 404));
    if (!course.isPublished) return res.status(400).json(createError('Course is not available', 400));

    // If course is paid, redirect to payment flow
    if (course.price > 0 && !course.isFree) {
      return res.status(402).json(createError('This course requires payment. Use the payment flow.', 402));
    }

    const exists = await Enrollment.findOne({ student: studentId, course: courseId });
    if (exists) return res.status(409).json(createError('Already enrolled in this course', 409));

    const enrollment = await Enrollment.create({
      student: studentId,
      course: courseId,
      paymentStatus: 'free',
    });

    // Increment course enrollment count
    await Course.findByIdAndUpdate(courseId, { $inc: { enrollmentCount: 1 } });

    res.status(201).json(createSuccess(enrollment, 'Enrolled successfully'));
  } catch (err) {
    next(err);
  }
};

// ─── Get Student's Enrollments ────────────────────────────────────────────────

exports.getStudentEnrollments = async (req, res, next) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user.id })
      .populate('course', 'title thumbnail category level price duration avgRating enrollmentCount')
      .sort({ createdAt: -1 });
    res.json(createSuccess(enrollments));
  } catch (err) {
    next(err);
  }
};

// ─── Update Progress (mark lesson complete) ───────────────────────────────────

exports.updateProgress = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const { lessonId } = req.body; // lesson ObjectId

    const enrollment = await Enrollment.findOne({ course: courseId, student: req.user.id });
    if (!enrollment) return res.status(404).json(createError('Enrollment not found', 404));

    // Add lesson to completed list if not already there
    const alreadyCompleted = enrollment.progress.completedLessons.some(
      (id) => id.toString() === lessonId
    );
    if (!alreadyCompleted) {
      enrollment.progress.completedLessons.push(lessonId);
    }

    // Compute total lessons dynamically from the course
    const course = await Course.findById(courseId).select('modules');
    const totalLessons = course
      ? course.modules.reduce((sum, mod) => sum + (mod.lessons?.length || 0), 0)
      : 1;

    const completed = enrollment.progress.completedLessons.length;
    enrollment.progress.percentage = totalLessons > 0
      ? Math.round((completed / totalLessons) * 100)
      : 0;
    enrollment.progress.lastAccessedLesson = lessonId;

    // Mark as completed if 100%
    if (enrollment.progress.percentage === 100 && !enrollment.progress.completedAt) {
      enrollment.progress.completedAt = new Date();
    }

    await enrollment.save();
    res.json(createSuccess(enrollment.progress, 'Progress updated'));
  } catch (err) {
    next(err);
  }
};

// ─── Get Progress for a Course ────────────────────────────────────────────────

exports.getCourseProgress = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const enrollment = await Enrollment.findOne({ course: courseId, student: req.user.id });
    if (!enrollment) return res.status(404).json(createError('Not enrolled in this course', 404));
    res.json(createSuccess(enrollment.progress));
  } catch (err) {
    next(err);
  }
};
