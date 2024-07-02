const express = require('express');
const router = express.Router();
const { db } = require('../database');
const { addTest } = require('../controllers/testController');

// Existing GET route for retrieving tests for a course
router.get('/tests/:course_id', async (req, res) => {
  const { course_id } = req.params;
  try {
    const tests = await db.manyOrNone(
      'SELECT exams.id, exams.name, exams.date_marked, courses.name AS course_name FROM exams JOIN courses ON exams.course_id = courses.id WHERE course_id = $1 ORDER BY date_marked DESC',
      [course_id]
    );
    const response = tests.map(test => ({
      ...test,
      mean: '86.2%' // Placeholder mean score, replace with actual calculation if needed
    }));
    res.json(response);
  } catch (error) {
    console.error(`Error getting tests for course id ${course_id}`, error);
    res.status(500).send('Server error');
  }
});

// New POST route for adding a test
router.post('/add', addTest);

module.exports = router;
