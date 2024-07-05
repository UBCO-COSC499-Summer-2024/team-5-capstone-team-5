const express = require('express');
const multer = require('multer');
const fs = require('fs');
const { PDFDocument } = require('pdf-lib');
const { getCoursesByUserId, getTestsByCourseId, getRecentExamsByUserId, getQuestionData, getStudentsByCourseId, addCourse, addStudent, deleteTest, editTest, register, addResponse, addAnswerKey, addStudentAnswers, getExamAnswers, calculateGrades } = require('../controllers/userController');
const { addTest } = require('../controllers/testController'); // Import the testController
const csv = require('csv-parser');
const stream = require('stream');

const router = express.Router();
const upload = multer();

// URL = localhost/api/users/courses/student_id
router.get('/courses/:id', async (req, res) => {
    try {
        const courses = await getCoursesByUserId(req.params.id);
        res.status(200).json(courses);
    } catch(error) {
        res.status(404).json({ error: error.message });
    }
});

// URL = localhost/api/users/tests/course_id
router.get('/tests/:id', async (req, res) => {
    try {
        const tests = await getTestsByCourseId(req.params.id);
        res.status(200).json(tests);
    } catch(error) {
        res.status(404).json({ error: error.message });
    }
});

router.get('/questions/answers/:examId', async (req, res) => {
    try {
        const questions = await getExamAnswers(req.params.examId);
        res.status(200).json(questions);
    } catch(error) {
        res.status(404).json({ error: error.message });
    }
});

// URL = localhost/api/users/questions/exam_id
router.get('/questions/:eid&:uid', async (req, res) => {
    try {
        const questions = await getQuestionData(req.params.uid, req.params.eid);
        res.status(200).json(questions);
    } catch(error) {
        res.status(404).json({ error: error.message });
    }
});

// URL = localhost/api/users/tests/recent/student_id
router.get('/tests/recent/:id', async (req, res) => {
    const id = req.params.id;
    if(id) {
        try {
            const courses = await getRecentExamsByUserId(req.params.id);
            res.status(200).json(courses);
        } catch(error) {
            res.status(404).json({ error: error.message });
        };
    } else {
        res.status(404).json({error: "No id found"});
    }
});

router.post('/courses/add', async (req, res) => {
    const { name, description, end_date, user_id } = req.body;
    if(name && description && end_date && user_id) {
        try {
            const newCourse = await addCourse(user_id, name, description, end_date);
            res.status(200).json(newCourse);
        } catch(error) {
            res.status(400).json({error: error.message});
        }
    } else {
        res.status(400).json({error: "Missing info for adding a course"});
    }
});

router.post('/tests/add', addTest); // Use testController for adding tests

router.delete('/tests/delete/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await deleteTest(id);
        res.status(200).json({ message: `Test with id ${id} deleted successfully` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/tests/edit/:id', async (req, res) => {
    const { id } = req.params;
    const { newName } = req.body;
    try {
        await editTest(id, newName);
        res.status(200).json({ message: `Test with id ${id} edited successfully` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/courses/students/:id', async (req, res) => {
    try {
        const studentList = await getStudentsByCourseId(req.params.id);
        res.status(200).json(studentList);
    } catch(error) {
        res.status(400).json({error: error.message});
    }
})

module.exports = router;
