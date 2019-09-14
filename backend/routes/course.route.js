const express = require('express');
const router = express.Router();
const courseController = require('../controllers/course.controller');

const auth = require('../middleware/auth');
const multer = require('../middleware/multer.config');

router.post('/', multer, courseController.createCourse);
router.put('/:id', multer, courseController.updateCourse);
router.get('/:id', courseController.getCourse);
router.get('/getVideos', courseController.getVideos);
router.get('/', courseController.getCourses);
router.delete('/:id', courseController.deleteCourse)

module.exports = router;