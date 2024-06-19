const { db } = require('../database');

const getAllCourses = async (req, res) => {
  try {
    const courses = await db.any('SELECT * FROM courses');
    res.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const addCourse = async (req, res) => {
  const { name, description, end_date } = req.body;
  try {
    const course = await db.one(
      'INSERT INTO courses (name, description, end_date) VALUES ($1, $2, $3) RETURNING *',
      [name, description, end_date]
    );
    res.json(course);
  } catch (error) {
    console.error('Error adding course:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getAllCourses,
  addCourse,
};
