const { db } = require('../database');

const addTest = async (req, res) => {
  const { name, questions, courseId } = req.body;

  try {
    const result = await db.one(
      'INSERT INTO exams (name, course_id) VALUES ($1, $2) RETURNING id',
      [name, courseId]
    );
    const examId = result.id;

    for (const question of questions) {
      const { correctAnswer, num_options, weight } = question;
      const formattedCorrectAnswer = correctAnswer.length ? correctAnswer.map(Number) : [];
      await db.none(
        'INSERT INTO questions (exam_id, correct_answer, num_options, weight) VALUES ($1, $2::integer[], $3, $4)',
        [examId, formattedCorrectAnswer, num_options || null, weight || null]
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
