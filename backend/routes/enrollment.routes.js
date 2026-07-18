// routes/enrollment.routes.js — FIXED: removed dead code after module.exports
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const requireRole = require('../middlewares/role.middleware');
const {
  enrollInCourse,
  getStudentEnrollments,
  updateProgress,
  getCourseProgress,
} = require('../controllers/enrollment.controller');

router.post('/', auth, requireRole('student'), enrollInCourse);
router.get('/my', auth, requireRole('student'), getStudentEnrollments);
router.get('/:courseId/progress', auth, requireRole('student'), getCourseProgress);
router.put('/:courseId/progress', auth, requireRole('student'), updateProgress);

module.exports = router;