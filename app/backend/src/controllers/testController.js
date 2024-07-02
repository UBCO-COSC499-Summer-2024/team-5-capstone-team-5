const db = require('../database'); // Adjust the path to your database connection

const addTest = async (req, res) => {
  const { name, questions, courseId } = req.body;

  try {
    // Insert the new test
    const result = await db.query(
      'INSERT INTO exams (name, course_id) VALUES ($1, $2) RETURNING id',
      [name, courseId]
    );
    const examId = result.rows[0].id;

    // Insert each question
    for (const question of questions) {
      const { correctAnswer } = question;
      await db.query(
        'INSERT INTO questions (exam_id, correct_answer) VALUES ($1, $2)',
        [examId, correctAnswer]
      );
    }

    res.status(201).json({ id: examId, name, courseId, questions });
  } catch (error) {
    console.error('Error adding test:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  addTest,
};
