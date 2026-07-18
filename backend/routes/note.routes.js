// routes/note.routes.js
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const requireRole = require('../middlewares/role.middleware');
const { saveNote, getNote, deleteNote } = require('../controllers/note.controller');

router.post('/', auth, requireRole('student'), saveNote);
router.get('/:courseId', auth, requireRole('student'), getNote);
router.delete('/:courseId', auth, requireRole('student'), deleteNote);

module.exports = router;
