// routes/course.routes.js
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const requireRole = require('../middlewares/role.middleware');
const {
  getCourses,
  getCourseById,
  getInstructorCourses,
  addCourse,
  updateCourse,
  deleteCourse,
} = require('../controllers/course.controller');

// Public routes (auth optional — controller handles the difference)
router.get('/', getCourses);
router.get('/my', auth, requireRole('instructor'), getInstructorCourses);
router.get('/:id', getCourseById);

// Protected routes
router.post('/', auth, requireRole('instructor', 'admin'), addCourse);
router.put('/:id', auth, requireRole('instructor', 'admin'), updateCourse);
router.delete('/:id', auth, requireRole('instructor', 'admin'), deleteCourse);

module.exports = router;