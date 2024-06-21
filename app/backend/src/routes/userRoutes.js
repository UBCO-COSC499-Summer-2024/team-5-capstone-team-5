const express = require('express');
const { getCoursesByUserId, getTestsByCourseId, getRecentExamsByUserId, addCourse, register, getQuestionsByExamId, getResponse } = require('../controllers/userController');

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
        const questions = await getQuestionsByExamId(req.params.eid, req.params.uid);
        res.status(200).json(questions);
    } catch(error) {
        res.status(404).json({ error: error.message });
    }
});

router.get('/responses/:qid&:uid', async (req, res) => {
    const qid = req.params.qid;
    const uid = req.params.uid;
    if(qid && uid) {
        try {
            const responses = await getResponse(uid, qid);
            res.status(200).json(responses);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    } else {
        res.status(404).json({error: "Could not find one of: qid, uid"});
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

module.exports = router;