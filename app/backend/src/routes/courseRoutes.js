const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const {
    getAllCourses,
    addCourse,
    getCoursesByUserId,
    getCourseInfo,
    calculateGrades,
} = require('../controllers/courseController');

// URL Begins With: localhost/api/courses

router.get('/', courseController.getAllCourses);
router.post('/', courseController.addCourse);

router.get('/:id', async (req, res) => {
    try {
        const courses = await getCoursesByUserId(req.params.id);
        res.status(200).json(courses);
    } catch(error) {
        res.status(404).json({ error: error.message });
    }
});

router.post('/add', async (req, res) => {
    const { name, description, end_date, user_id } = req.body;
    if(name && description && end_date && user_id) {
        try {
            const newCourse = await addCourse(user_id, name, description, end_date);
            res.status(200).json(newCourse);
        } catch(error) {
            res.status(500).json({error: error.message});
        }
    } else {
        res.status(400).json({error: "Missing info for adding a course"});
    }
});

router.get('/info/:id', async (req, res) => {
    try {
        const data = await getCourseInfo(req.params.id);
        res.status(200).json(data);
    } catch(error) {
        res.status(500).json({error: error.message});
    }
});

router.get('/grades/:id', async (req, res) => {
    const id = req.params.id;
    if(id) {
        try {
            const grades = await calculateGrades(req.params.id);
            res.status(200).json(grades);
        } catch(error) {
            res.status(400).json({error: error.message});
        }
    } else {
        res.status(400).json({error: "id is not sent"});
    }
});

module.exports = router;
