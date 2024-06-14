const express = require('express');
const { getCoursesByUserId, getTestsByCourseId } = require('../controllers/userController');

const router = express.Router();

// url = localhost/api/users/courses/student_id
router.get('/courses/:id', async (req, res) => {
    try {
        const grades = await getCoursesByUserId(req.params.id);
        res.status(200).json(grades);
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

router.get('/questions/:id', async (req, res) => {
    try {
        const questions = await getQuestionsByExamId(req.params.id);
        res.status(200).json(questions);
    } catch(error) {
        res.status(404).json({ error: error.message });
    }
});

router.get('/responses/:qid&uid', async (req, res) => {
    try {
        const responses = await getResponsesByQuestion(req.params.uid, req.params.qid);
        res.status(200).json(responses);
    } catch(error) {
        res.status(404).json({ error: error.message });
    }
});

module.exports = router;