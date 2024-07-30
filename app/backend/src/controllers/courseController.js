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

const getCoursesByUserId = async (id) => {
  try {
      const response = await db.manyOrNone(
          'SELECT course_id, name, description, end_date FROM users JOIN registration ON registration.user_id = users.id JOIN courses ON registration.course_id = courses.id WHERE users.id = $1', [id]
      );
      return response;
  } catch(error) {
      console.log(`Error getting course data for id ${id}`,error);
  };
};

const getCourseInfo = async (id) => {
  try {
      const response = await db.oneOrNone(
          'SELECT * FROM courses WHERE id = $1', [id]
      );
      return response;
  } catch(error) {
      console.error(`Error getting course data for course id ${id}`, error);
  }
}

const addCourse = async (user_id, name, description, end_date) => {
  try {
      const dateRegex = /^\d{4}-(0?[1-9]|1[0-2])-(0?[1-9]|[12]\d|3[01])$/;
      if(dateRegex.test(end_date)) {
          await db.none(
              'INSERT INTO courses (name, description, end_date) VALUES ($1, $2, $3)', [name, description, end_date]
          );
          const response = await db.oneOrNone(
              'SELECT id FROM courses WHERE name = $1 AND description = $2 AND end_date = $3', [name, description, end_date]
          )
          await register(user_id, response.id);
          const newCourse = { user_id, name, description, end_date, course_id: response.id };
          return newCourse;
      } else {
          console.error('Invalid date. Please use yyyy-mm-dd');
          return null;
      };
  } catch(error) {
      console.error(`Error adding course ${name}`);
  };
};

module.exports = {
  getAllCourses,
  addCourse,
};
