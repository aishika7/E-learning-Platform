const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const { getCourses, getCourseById, addCourse } = require('../controllers/course.controller');


router.get('/', auth, getCourses);
// router.get('/:id', getCourseById);
router.post('/', auth, addCourse); // protected

module.exports = router;