const { db } = require('../database');
const { addScan } = require('./userController');
const fs = require('fs');
const { addQuestion } = require('./questionController');
const { flagExam, flagResponse } = require('./flagController');
const { addResponse } = require('./responseController');

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

const addExam = async (course_id, name) => {
  try {
      const id = await db.any(
          'INSERT INTO exams (course_id, name) VALUES ($1, $2) RETURNING id', [course_id, name]
      );
      return id;
  } catch(error) {
      console.error(`Error adding the exam ${name}`);
  };
};

const editTest = async (testId, newName) => {
  try {
      await db.none('UPDATE exams SET name = $1 WHERE id = $2', [newName, testId]);
  } catch (error) {
      console.error(`Error editing test with id ${testId}:`, error);
      throw error;
  }
};

const deleteTest = async (testId) => {
  try {
      await db.none('DELETE FROM exams WHERE id = $1', [testId]);
  } catch (error) {
      console.error(`Error deleting test with id ${testId}:`, error);
      throw error;
  }
};

const getTestsByCourseId = async (id) => {
  try {
      const response = await db.manyOrNone(
          'SELECT exams.id, date_marked, exams.name, courses.department, courses.code, courses.section FROM exams JOIN courses ON exams.course_id = courses.id WHERE course_id = $1 ORDER BY date_marked DESC', [id]
      );
      return response;
  } catch(error) {
      console.error(`Error getting course data for id ${id}`,error);
  };
};

const getRecentExamsByUserId = async (id) => {
  try {
      const response = await db.manyOrNone(
          'SELECT exams.id, date_marked, exams.name, courses.department, courses.code, courses.section AS course_name FROM users INNER JOIN registration ON users.id = registration.user_id INNER JOIN courses ON registration.course_id = courses.id INNER JOIN exams ON courses.id = exams.course_id WHERE users.id = $1 ORDER BY date_marked DESC', [id]
      );
      return response;
  } catch(error) {
      console.log(`Error getting recent courses for user id ${id}`,error);
  }
}

const setExamMarked = async (examId) => {
  try {
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().split("T")[0];
      await db.none('UPDATE exams SET date_marked = $1 WHERE id = $2', [formattedDate, examId]);
  } catch(error) {
      console.error('Error updating exam marked date for exam:',examId);
      throw error;
  }
}



const addStudentAnswers = async (jsonData, examId) => {
  const flaggedQuestions = {
      "NoStudentId": [],
      "DuplicateStudentId": [],
      "MultipleResponses": {},
      "NoResponses": {},
  }
  const studentIds = []
  for (const key in jsonData) {
      if(jsonData.hasOwnProperty(key)) {
          const answerKey = jsonData[key];
          const studentId = answerKey.stnum
          const responses = answerKey.answers[0]
          const questionsWithNoResponse = answerKey.answers[1];
          const multiResponse = answerKey.answers[2];
          const page = answerKey.page;
          const image = answerKey.combined_page;
          const imageBuffer = Buffer.from(image, 'base64');
          const imagesDir = '/code/images';
          const imagePath = `/code/images/${examId}_${studentId}.png`;
          const databasePath = `/images/${examId}_${studentId}.png`;

          if (!fs.existsSync(imagesDir)) {
              fs.mkdirSync(imagesDir, { recursive: true });
          }
          fs.writeFileSync(imagePath, imageBuffer);

          if(studentId) {
              console.log(studentId);
              if(studentIds.includes(studentId)) {
                  flaggedQuestions["DuplicateStudentId"].push(studentId);
                  console.log("Duplicate ID")
                  flagExam(examId, `Duplicate student ID for scan on page ${page} / ${page+1}`)
              } else {
                  studentIds.push(studentId);
                  console.log(studentIds);
              }
              responses.forEach((response) => {
                  const recordedAnswer = response.LetterPos;
                  const questionNum = response.Question;
                  addResponse(examId, questionNum, studentId, recordedAnswer)
              });
              questionsWithNoResponse.forEach((question) => {
                  addResponse(examId, question, studentId, `{}`)
              });
              if(multiResponse.length > 0) {
                  flaggedQuestions["MultipleResponses"][String(studentId)] = multiResponse;
                  multiResponse.forEach((question) => {
                      flagResponse(examId, studentId, question, "Multiple answers were detected")
                  });
              }
              if(questionsWithNoResponse.length > 0) {
                  flaggedQuestions["NoResponses"][String(studentId)] = questionsWithNoResponse;
                  questionsWithNoResponse.forEach((question) => {
                      flagResponse(examId, studentId, question, "No answers were detected")
                  });
              }
              addScan(examId, studentId, databasePath)
          } else {
              flaggedQuestions["NoStudentId"].push(`Page ${page} / ${page+1}`);
              flagExam(examId, `No student ID for scan on page ${page} / ${page+1}`);
          }
      };
  }
  return flaggedQuestions;
}

const addAnswerKey = async (jsonData, examId, userId) => {
  for (const key in jsonData) {
      if(jsonData.hasOwnProperty(key)) {
          const answerKey = jsonData[key];
          const responses = answerKey.answers[0];
          const noResponse = answerKey.answers[1];
          const multiResponse = answerKey.answers[2];
          const image = answerKey.combined_page;
          const imageBuffer = Buffer.from(image, 'base64');
          const imagesDir = ('/code/images');
          const imagePath = `/code/images/${examId}_${userId}.png`;
          const databasePath = `/images/${examId}_${userId}.png`;
          if (!fs.existsSync(imagesDir)) {
              fs.mkdirSync(imagesDir, { recursive: true });
          }
          fs.writeFileSync(imagePath, imageBuffer);

          responses.forEach((response) => {
              const correctAnswer = response.LetterPos;
              const questionNum = response.Question;
              console.log("Correct Answer:",correctAnswer)
              addQuestion(examId, 5, correctAnswer, 1, questionNum);
          })
          addScan(examId, userId, databasePath);
      };
  }
}

module.exports = {
  addTest,
  addExam,
  editTest,
  deleteTest,
  getTestsByCourseId,
  getRecentExamsByUserId,
  setExamMarked,
  addStudentAnswers,
  addAnswerKey
};
