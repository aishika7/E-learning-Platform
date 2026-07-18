// controllers/admin.controller.js
const User = require('../models/user.model');
const Course = require('../models/course.model');
const { createSuccess, createError, createPaginated } = require('../utils/response.utils');

// ─── List All Users ───────────────────────────────────────────────────────────

exports.getUsers = async (req, res, next) => {
  try {
    const { role, search, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (role) filter.role = role;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [users, total] = await Promise.all([
      User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
      User.countDocuments(filter),
    ]);

    res.json(createPaginated(users, total, parseInt(page), parseInt(limit)));
  } catch (err) {
    next(err);
  }
};

// ─── Change User Role ─────────────────────────────────────────────────────────

exports.changeUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    const validRoles = ['student', 'instructor', 'admin'];
    if (!validRoles.includes(role)) {
      return res.status(400).json(createError('Invalid role', 400));
    }
    if (req.params.id === req.user.id) {
      return res.status(400).json(createError('Cannot change your own role', 400));
    }

    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
    if (!user) return res.status(404).json(createError('User not found', 404));
    res.json(createSuccess(user, 'User role updated'));
  } catch (err) {
    next(err);
  }
};

// ─── Toggle User Status ───────────────────────────────────────────────────────

exports.toggleUserStatus = async (req, res, next) => {
  try {
    if (req.params.id === req.user.id) {
      return res.status(400).json(createError('Cannot change your own status', 400));
    }
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json(createError('User not found', 404));

    user.isActive = !user.isActive;
    await user.save();
    res.json(createSuccess({ isActive: user.isActive }, `User ${user.isActive ? 'activated' : 'deactivated'}`));
  } catch (err) {
    next(err);
  }
};

// ─── Delete User ──────────────────────────────────────────────────────────────

exports.deleteUser = async (req, res, next) => {
  try {
    if (req.params.id === req.user.id) {
      return res.status(400).json(createError('Cannot delete your own account', 400));
    }
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json(createError('User not found', 404));
    res.json(createSuccess(null, 'User deleted successfully'));
  } catch (err) {
    next(err);
  }
};

// ─── Toggle Course Publish Status ─────────────────────────────────────────────

exports.toggleCoursePublish = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json(createError('Course not found', 404));

    course.isPublished = !course.isPublished;
    await course.save();
    res.json(createSuccess({ isPublished: course.isPublished }, `Course ${course.isPublished ? 'published' : 'unpublished'}`));
  } catch (err) {
    next(err);
  }
};
