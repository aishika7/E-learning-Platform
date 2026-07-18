// routes/admin.routes.js
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const requireRole = require('../middlewares/role.middleware');
const {
  getUsers,
  changeUserRole,
  toggleUserStatus,
  deleteUser,
  toggleCoursePublish,
} = require('../controllers/admin.controller');

router.get('/users', auth, requireRole('admin'), getUsers);
router.put('/users/:id/role', auth, requireRole('admin'), changeUserRole);
router.put('/users/:id/status', auth, requireRole('admin'), toggleUserStatus);
router.delete('/users/:id', auth, requireRole('admin'), deleteUser);
router.put('/courses/:id/publish', auth, requireRole('admin'), toggleCoursePublish);

module.exports = router;
