const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const { saveNote } = require('../controllers/note.controller');

router.post('/', auth, saveNote);

module.exports = router;
