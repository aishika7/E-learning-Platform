// controllers/course.controller.js
const Course = require('../models/course.model');
const { createSuccess, createError, createPaginated } = require('../utils/response.utils');

// ─── Get All Courses (public, with filters) ───────────────────────────────────

exports.getCourses = async (req, res, next) => {
  try {
    const { search, category, level, page = 1, limit = 12 } = req.query;
    const filter = { isPublished: true };

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
      ];
    }
    if (category) filter.category = category;
    if (level) filter.level = level;

    // Instructors see their own unpublished courses too
    if (req.user?.role === 'instructor') {
      delete filter.isPublished;
      filter.$or = filter.$or
        ? [{ ...filter }, { createdBy: req.user.id }]
        : [{ isPublished: true }, { createdBy: req.user.id }];
    }
    if (req.user?.role === 'admin') {
      delete filter.isPublished; // Admin sees everything
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [courses, total] = await Promise.all([
      Course.find(filter)
        .populate('createdBy', 'name avatar')
        .select('-modules.lessons.videoUrl') // Don't expose video URLs in list
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Course.countDocuments(filter),
    ]);

    res.json(createPaginated(courses, total, parseInt(page), parseInt(limit)));
  } catch (err) {
    next(err);
  }
};

// ─── Get Course By ID ─────────────────────────────────────────────────────────

exports.getCourseById = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id).populate('createdBy', 'name avatar bio');
    if (!course) return res.status(404).json(createError('Course not found', 404));

    // Only expose video URLs if user is enrolled or is the instructor/admin
    if (!req.user || (req.user.role === 'student')) {
      // For non-enrolled students, only show preview lessons
      // (enrollment check happens in a separate endpoint)
      const sanitized = course.toObject();
      sanitized.modules = sanitized.modules.map(mod => ({
        ...mod,
        lessons: mod.lessons.map(l => ({
          ...l,
          videoUrl: l.isPreview ? l.videoUrl : undefined,
        })),
      }));
      return res.json(createSuccess(sanitized));
    }

    res.json(createSuccess(course));
  } catch (err) {
    next(err);
  }
};

// ─── Get Instructor's Courses ─────────────────────────────────────────────────

exports.getInstructorCourses = async (req, res, next) => {
  try {
    const courses = await Course.find({ createdBy: req.user.id })
      .sort({ createdAt: -1 })
      .lean();
    res.json(createSuccess(courses));
  } catch (err) {
    next(err);
  }
};

// ─── Create Course ────────────────────────────────────────────────────────────

exports.addCourse = async (req, res, next) => {
  try {
    const course = new Course({ ...req.body, createdBy: req.user.id, isPublished: false });
    await course.save();
    res.status(201).json(createSuccess(course, 'Course created successfully'));
  } catch (err) {
    next(err);
  }
};

// ─── Update Course ────────────────────────────────────────────────────────────

exports.updateCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json(createError('Course not found', 404));

    // Only instructor who owns it or admin can update
    if (req.user.role === 'instructor' && course.createdBy.toString() !== req.user.id) {
      return res.status(403).json(createError('You can only edit your own courses', 403));
    }

    const updated = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.json(createSuccess(updated, 'Course updated successfully'));
  } catch (err) {
    next(err);
  }
};

// ─── Delete Course ────────────────────────────────────────────────────────────

exports.deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json(createError('Course not found', 404));

    if (req.user.role === 'instructor' && course.createdBy.toString() !== req.user.id) {
      return res.status(403).json(createError('You can only delete your own courses', 403));
    }

    await course.deleteOne();
    res.json(createSuccess(null, 'Course deleted successfully'));
  } catch (err) {
    next(err);
  }
};
