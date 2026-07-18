// routes/dashboard.routes.js
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const requireRole = require('../middlewares/role.middleware');
const {
  getAdminMetrics,
  getInstructorMetrics,
  getStudentMetrics,
} = require('../controllers/dashboard.controller');

router.get('/admin', auth, requireRole('admin'), getAdminMetrics);
router.get('/instructor', auth, requireRole('instructor'), getInstructorMetrics);
router.get('/student', auth, requireRole('student'), getStudentMetrics);

module.exports = router;
