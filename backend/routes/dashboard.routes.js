const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const { getAdminMetrics, getInstructorMetrics } = require('../controllers/dashboard.controller');

router.get('/admin', auth, getAdminMetrics);
router.get('/instructor', auth, getInstructorMetrics);

module.exports = router;
