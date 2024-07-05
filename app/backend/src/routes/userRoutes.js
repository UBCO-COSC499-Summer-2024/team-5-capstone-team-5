const express = require('express');
const { getCoursesByUserId, getTestsByCourseId, getRecentExamsByUserId, addCourse, getQuestionData, getStudentsByCourseId, addExam, addQuestion, calculateGrades } = require('../controllers/userController');

const router = express.Router();

// url = localhost/api/users/courses/student_id
router.get('/courses/:id', async (req, res) => {
    try {
        const courses = await getCoursesByUserId(req.params.id);
        res.status(200).json(courses);
    } catch(error) {
        res.status(404).json({ error: error.message });
    }
});
// url = localhost/api/users/tests/course_id
router.get('/tests/:id', async (req, res) => {
    try {
        const tests = await getTestsByCourseId(req.params.id);
        res.status(200).json(tests);
    } catch(error) {
        res.status(404).json({ error: error.message });
    }
});

router.get('/questions/:eid&:uid', async (req, res) => {
    try {
        const questions = await getQuestionData(req.params.uid, req.params.eid);
        res.status(200).json(questions);
    } catch(error) {
        res.status(404).json({ error: error.message });
    }
});

router.get('/responses/:eid&:uid', async (req, res) => {
    try {
        const responses = await getQuestionData(req.params.uid, req.params.eid);
        res.status(200).json(responses);
    } catch(error) {
        res.status(404).json({ error: error.message });
    }
});

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
    const { name, description, end_date, user_id, course_id } = req.body;
    if(name && description && end_date && user_id && course_id) {
        try {
            const newCourse = await addCourse(user_id, name, description, end_date);
            res.status(200).json(newCourse);
        } catch(error) {
            res.status(404).json({error: error.message});
        }
    } else {
        res.status(404).json({error: "Missing info for adding a course"});
    }
});

router.post('/tests/add', async (req, res) => {
    const test = req.body;
    if(test) {
        try {
            const name = test.name;
            const questions = test.questions;
            const courseId = test.courseId;
            const response = await addExam(courseId, name);
            const id = response.id
            questions.forEach(async (question) => {
                answerLength = question.correctAnswer.length;
                await addQuestion(id, answerLength, question.correct_anwers, answerLength);
            });
            res.status(200).json({message: "Test added successfully"})

        } catch(error) {
            res.status(404).json({error: error.message});
        }
    } else {
        res.status(404).json({error: "Missing information for adding a test"})
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

router.get('/courses/grades/:id', async (req, res) => {
    try {
        const grades = await calculateGrades(req.params.id);
        res.status(200).json(grades)
    } catch(error) {
        res.status(400).json({error: error.message});
    }
});

module.exports = router;