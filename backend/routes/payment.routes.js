// routes/payment.routes.js — FIXED: single import, no duplicate handlers
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const requireRole = require('../middlewares/role.middleware');
const { createOrder, verifyPayment } = require('../controllers/payment.controller');

router.post('/create-order', auth, requireRole('student'), createOrder);
router.post('/verify', auth, requireRole('student'), verifyPayment);

module.exports = router;
