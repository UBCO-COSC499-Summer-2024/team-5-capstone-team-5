const express = require('express');
const multer = require('multer');
const router = express.Router();
const upload = multer();
const {
    getTestsByCourseId,
    getRecentExamsByUserId,
    addTest,
    deleteTest,
    editTest,
    addAnswerKey,
    addStudentAnswers,
} = require('../controllers/testController');

// URL = localhost/api/users/tests/course_id

router.post('/add', addTest); // Use testController for adding tests

// URL = localhost/api/users/tests/recent/student_id
router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await deleteTest(id);
        res.status(200).json({ message: `Test with id ${id} deleted successfully` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    try {
        await editTest(id, name);
        console.log("Test name: ",name)
        res.status(200).json({ message: `Test with id ${id} edited successfully` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const tests = await getTestsByCourseId(req.params.id);
        res.status(200).json(tests);
    } catch(error) {
        res.status(404).json({ error: error.message });
    }
});

router.post('/upload/answers', upload.single('file'), async (req, res) => {
    const response = await fetch('http://python-cv:8000/upload', {
        method: 'POST',
        body: req.file.buffer,
        headers: {
            'Content-Type': 'application/json',
            'testid': req.headers['testid'],
            'numquestions': req.headers['numquestions']
        }
    });
    const jsonData = await response.json();
    const testid = req.headers['testid'];
    const data = jsonData.data;
    addAnswerKey(data, testid, req.headers['userid']);
    res.status(200).json({message: "This will always pass"});
  });

  router.post('/upload/responses', upload.single('file'), async (req, res) => {
    const response = await fetch('http://python-cv:8000/upload', {
        method: 'POST',
        body: req.file.buffer,
        headers: {
            'Content-Type': 'application/json',
            'testid': req.headers['testid'],
            'numquestions': req.headers['numquestions']
        }
    });
    const jsonData = await response.json();
    const testid = req.headers['testid'];
    const data = jsonData.data;
    const flags = await addStudentAnswers(data, testid);
    res.status(200).json(flags);
  });

  module.exports = router;