const { db } = require('../database');
const {
  getCoursesByUserId,
  getTestsByCourseId,
  getRecentExamsByUserId,
  getQuestionData,
  getStudentsByCourseId,
  addStudent,
  addCourse,
  addExam,
  addQuestion,
  register,
  addStudentAnswers,
  addAnswerKey,
  deleteTest,
  editTest,
  calculateGrades,
  getExamAnswers,
  addResponse
} = require('./userController');

jest.mock('../database');

describe('User Controller', () => {
  let consoleLogSpy;
  let consoleErrorSpy;

  beforeEach(() => {
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  describe('getCoursesByUserId', () => {
    it('should respond with course data', async () => {
      const mockCourses = [
        { course_id: 1, name: 'Course 1', description: 'Description 1', end_date: '2024-12-31' },
        { course_id: 2, name: 'Course 2', description: 'Description 2', end_date: '2024-11-30' },
      ];
      db.manyOrNone.mockResolvedValue(mockCourses);

      const result = await getCoursesByUserId(1);

      expect(db.manyOrNone).toHaveBeenCalledWith(
        'SELECT course_id, name, description, end_date FROM users JOIN registration ON registration.user_id = users.id JOIN courses ON registration.course_id = courses.id WHERE users.id = $1', [1]
      );
      expect(result).toEqual(mockCourses);
    });

    it('should handle errors gracefully', async () => {
      db.manyOrNone.mockRejectedValue(new Error('Database error'));

      const result = await getCoursesByUserId(1);

      expect(db.manyOrNone).toHaveBeenCalledWith(
        'SELECT course_id, name, description, end_date FROM users JOIN registration ON registration.user_id = users.id JOIN courses ON registration.course_id = courses.id WHERE users.id = $1', [1]
      );
      expect(result).toBeUndefined();
      expect(console.log).toHaveBeenCalledWith('Error getting course data for id 1', expect.any(Error));
    });
  });

  describe('getTestsByCourseId', () => {
    it('should respond with test data', async () => {
      const mockTests = [
        { id: 1, date_marked: '2024-01-01', name: 'Test 1', course_name: 'Course 1' },
        { id: 2, date_marked: '2024-02-01', name: 'Test 2', course_name: 'Course 2' },
      ];
      db.manyOrNone.mockResolvedValue(mockTests);

      const result = await getTestsByCourseId(1);

      expect(db.manyOrNone).toHaveBeenCalledWith(
        'SELECT exams.id, date_marked, exams.name, courses.name AS course_name FROM exams JOIN courses ON exams.course_id = courses.id WHERE course_id = $1 ORDER BY date_marked DESC', [1]
      );
      expect(result).toEqual(mockTests);
    });

    it('should handle errors gracefully', async () => {
      db.manyOrNone.mockRejectedValue(new Error('Database error'));

      const result = await getTestsByCourseId(1);

      expect(db.manyOrNone).toHaveBeenCalledWith(
        'SELECT exams.id, date_marked, exams.name, courses.name AS course_name FROM exams JOIN courses ON exams.course_id = courses.id WHERE course_id = $1 ORDER BY date_marked DESC', [1]
      );
      expect(result).toBeUndefined();
      expect(console.error).toHaveBeenCalledWith('Error getting course data for id 1', expect.any(Error));
    });
  });

  describe('getRecentExamsByUserId', () => {
    it('should respond with recent exams', async () => {
      const mockExams = [
        { id: 1, date_marked: '2024-01-01', name: 'Exam 1', course_name: 'Course 1' },
        { id: 2, date_marked: '2024-02-01', name: 'Exam 2', course_name: 'Course 2' },
      ];
      db.manyOrNone.mockResolvedValue(mockExams);

      const result = await getRecentExamsByUserId(1);

      expect(db.manyOrNone).toHaveBeenCalledWith(
        'SELECT exams.id, date_marked, exams.name, courses.name AS course_name FROM users INNER JOIN registration ON users.id = registration.user_id INNER JOIN courses ON registration.course_id = courses.id INNER JOIN exams ON courses.id = exams.course_id WHERE users.id = $1 ORDER BY date_marked DESC', [1]
      );
      expect(result).toEqual(mockExams);
    });

    it('should handle errors gracefully', async () => {
      db.manyOrNone.mockRejectedValue(new Error('Database error'));

      const result = await getRecentExamsByUserId(1);

      expect(db.manyOrNone).toHaveBeenCalledWith(
        'SELECT exams.id, date_marked, exams.name, courses.name AS course_name FROM users INNER JOIN registration ON users.id = registration.user_id INNER JOIN courses ON registration.course_id = courses.id INNER JOIN exams ON courses.id = exams.course_id WHERE users.id = $1 ORDER BY date_marked DESC', [1]
      );
      expect(result).toBeUndefined();
      expect(console.log).toHaveBeenCalledWith('Error getting recent courses for user id 1', expect.any(Error));
    });
  });

  describe('getQuestionData', () => {
    it('should respond with question data', async () => {
      const mockQuestions = [
        { question_id: 1, user_id: 1, response: 'A', grade: 1, num_options: 4, correct_answer: 'A', question_num: 1, weight: 1, course_name: 'Course 1', exam_name: 'Exam 1' },
        { question_id: 2, user_id: 1, response: 'B', grade: 1, num_options: 4, correct_answer: 'B', question_num: 2, weight: 1, course_name: 'Course 1', exam_name: 'Exam 1' },
      ];
      db.manyOrNone.mockResolvedValue(mockQuestions);

      const result = await getQuestionData(1, 1);

      expect(db.manyOrNone).toHaveBeenCalledWith(
        'SELECT question_id, user_id, response, grade, num_options, correct_answer, q.question_num, weight, c.name AS course_name, e.name AS exam_name FROM responses r JOIN questions q ON r.question_id = q.id JOIN exams e ON e.id = q.exam_id JOIN courses c ON e.course_id = c.id WHERE e.id = $1 AND r.user_id = $2 ORDER BY q.question_num', [1, 1]
      );
      expect(result).toEqual(mockQuestions);
    });

    it('should handle errors gracefully', async () => {
      db.manyOrNone.mockRejectedValue(new Error('Database error'));

      const result = await getQuestionData(1, 1);

      expect(db.manyOrNone).toHaveBeenCalledWith(
        'SELECT question_id, user_id, response, grade, num_options, correct_answer, q.question_num, weight, c.name AS course_name, e.name AS exam_name FROM responses r JOIN questions q ON r.question_id = q.id JOIN exams e ON e.id = q.exam_id JOIN courses c ON e.course_id = c.id WHERE e.id = $1 AND r.user_id = $2 ORDER BY q.question_num', [1, 1]
      );
      expect(result).toBeUndefined();
      expect(console.log).toHaveBeenCalledWith('Error getting responses for exam', 1, 'and user', 1);
    });
  });

  describe('getExamAnswers', () => {
    it('should respond with exam answers', async () => {
      const mockAnswers = [
        { question_id: 1, correct_answer: 'A', weight: 1, question_num: 1, num_options: 4 },
        { question_id: 2, correct_answer: 'B', weight: 1, question_num: 2, num_options: 4 },
      ];
      db.manyOrNone.mockResolvedValue(mockAnswers);

      const result = await getExamAnswers(1);

      expect(db.manyOrNone).toHaveBeenCalledWith(
        'SELECT id AS question_id, correct_answer, weight, question_num, num_options FROM questions WHERE exam_id = $1 ORDER BY question_num', [1]
      );
      expect(result).toEqual(mockAnswers);
    });

    it('should handle errors gracefully', async () => {
      db.manyOrNone.mockRejectedValue(new Error('Database error'));

      const result = await getExamAnswers(1);

      expect(db.manyOrNone).toHaveBeenCalledWith(
        'SELECT id AS question_id, correct_answer, weight, question_num, num_options FROM questions WHERE exam_id = $1 ORDER BY question_num', [1]
      );
      expect(result).toBeUndefined();
      expect(console.log).toHaveBeenCalledWith('Error getting questions for exam', 1, expect.any(Error));
    });
  });

  describe('getStudentsByCourseId', () => {
    it('should respond with student data', async () => {
      const mockStudents = [
        { id: 1, first_name: 'John', last_name: 'Doe', role: 'student' },
        { id: 2, first_name: 'Jane', last_name: 'Doe', role: 'student' },
      ];
      db.manyOrNone.mockResolvedValue(mockStudents);

      const result = await getStudentsByCourseId(1);

      expect(db.manyOrNone).toHaveBeenCalledWith(
        'SELECT u.id, u.first_name, u.last_name, u.role FROM users u JOIN registration r ON u.id = r.user_id JOIN courses c ON r.course_id = c.id WHERE c.id = $1 ORDER BY last_name ASC, first_name ASC', [1]
      );
      expect(result).toEqual(mockStudents);
    });

    it('should handle errors gracefully', async () => {
      db.manyOrNone.mockRejectedValue(new Error('Database error'));

      const result = await getStudentsByCourseId(1);

      expect(db.manyOrNone).toHaveBeenCalledWith(
        'SELECT u.id, u.first_name, u.last_name, u.role FROM users u JOIN registration r ON u.id = r.user_id JOIN courses c ON r.course_id = c.id WHERE c.id = $1 ORDER BY last_name ASC, first_name ASC', [1]
      );
      expect(result).toBeUndefined();
      expect(console.log).toHaveBeenCalledWith('Error getting students for course:', 1);
    });
  });

  describe('addStudent', () => {
    it('should add a student and register them if courseId is provided', async () => {
      db.none.mockResolvedValue();
      const mockRegister = jest.spyOn(require('./userController'), 'register').mockImplementation(() => Promise.resolve());

      await addStudent(1, 'John', 'Doe', 'john@example.com', 'password', 1);

      expect(db.none).toHaveBeenCalledWith(
        'INSERT INTO users (id, first_name, last_name, email, password, role) VALUES ($1, $2, $3, $4, $5, 1) ON CONFLICT (email) DO NOTHING',
        [1, 'John', 'Doe', 'john@example.com', 'password']
      );
    });

    it('should add a student without registering them if no courseId is provided', async () => {
      db.none.mockResolvedValue();
      const mockRegister = jest.spyOn(require('./userController'), 'register').mockImplementation(() => Promise.resolve());

      await addStudent(1, 'John', 'Doe', 'john@example.com', 'password', null);

      expect(db.none).toHaveBeenCalledWith(
        'INSERT INTO users (id, first_name, last_name, email, password, role) VALUES ($1, $2, $3, $4, $5, 1) ON CONFLICT (email) DO NOTHING',
        [1, 'John', 'Doe', 'john@example.com', 'password']
      );
      expect(mockRegister).not.toHaveBeenCalled();

      mockRegister.mockRestore();
    });

    it('should handle errors gracefully', async () => {
      db.none.mockRejectedValue(new Error('Database error'));
      const mockRegister = jest.spyOn(require('./userController'), 'register').mockImplementation(() => Promise.resolve());

      await addStudent(1, 'John', 'Doe', 'john@example.com', 'password', 1);

      expect(db.none).toHaveBeenCalledWith(
        'INSERT INTO users (id, first_name, last_name, email, password, role) VALUES ($1, $2, $3, $4, $5, 1) ON CONFLICT (email) DO NOTHING',
        [1, 'John', 'Doe', 'john@example.com', 'password']
      );
      expect(console.error).toHaveBeenCalledWith('Error adding student John, Doe');
      expect(mockRegister).not.toHaveBeenCalled();

      mockRegister.mockRestore();
    });
  });

  describe('addCourse', () => {
    it('should add a course and register the user', async () => {
      const mockCourse = { id: 1 };
      db.none.mockResolvedValue();
      db.oneOrNone.mockResolvedValue(mockCourse);
      const mockRegister = jest.spyOn(require('./userController'), 'register').mockResolvedValue();

      const result = await addCourse(1, 'Course 1', 'Description 1', '2024-12-31');

      expect(db.none).toHaveBeenCalledWith(
        'INSERT INTO courses (name, description, end_date) VALUES ($1, $2, $3)',
        ['Course 1', 'Description 1', '2024-12-31']
      );
      expect(db.oneOrNone).toHaveBeenCalledWith(
        'SELECT id FROM courses WHERE name = $1 AND description = $2 AND end_date = $3',
        ['Course 1', 'Description 1', '2024-12-31']
      );
      expect(result).toEqual({ user_id: 1, name: 'Course 1', description: 'Description 1', end_date: '2024-12-31', course_id: 1 });

      mockRegister.mockRestore();
    });

    it('should handle invalid date format', async () => {
      const result = await addCourse(1, 'Course 1', 'Description 1', 'invalid-date');

      expect(db.none).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledWith('Invalid date. Please use yyyy-mm-dd');
      expect(result).toBeNull();
    });

    it('should handle errors gracefully', async () => {
      db.none.mockRejectedValue(new Error('Database error'));

      await addCourse(1, 'Course 1', 'Description 1', '2024-12-31');

      expect(db.none).toHaveBeenCalledWith(
        'INSERT INTO courses (name, description, end_date) VALUES ($1, $2, $3)',
        ['Course 1', 'Description 1', '2024-12-31']
      );
      expect(console.error).toHaveBeenCalledWith('Error adding course Course 1');
    });
  });

  describe('register', () => {
    it('should register a user to a course', async () => {
      db.none.mockResolvedValue();

      await register(1, 1);

      expect(db.none).toHaveBeenCalledWith(
        'INSERT INTO registration (user_id, course_id) VALUES ($1, $2) ON CONFLICT (user_id, course_id) DO NOTHING', [1, 1]
      );
    });

    it('should handle errors gracefully', async () => {
      db.none.mockRejectedValue(new Error('Database error'));

      await register(1, 1);

      expect(db.none).toHaveBeenCalledWith(
        'INSERT INTO registration (user_id, course_id) VALUES ($1, $2) ON CONFLICT (user_id, course_id) DO NOTHING', [1, 1]
      );
      expect(console.error).toHaveBeenCalledWith('Error registering user with ID ', 1, 'into course with ID', 1);
    });
  });

  describe('addExam', () => {
    it('should add an exam', async () => {
      const mockId = [{ id: 1 }];
      db.any.mockResolvedValue(mockId);

      const result = await addExam(1, 'Exam 1');

      expect(db.any).toHaveBeenCalledWith(
        'INSERT INTO exams (course_id, name) VALUES ($1, $2) RETURNING id', [1, 'Exam 1']
      );
      expect(result).toEqual(mockId);
    });

    it('should handle errors gracefully', async () => {
      db.any.mockRejectedValue(new Error('Database error'));

      await addExam(1, 'Exam 1');

      expect(db.any).toHaveBeenCalledWith(
        'INSERT INTO exams (course_id, name) VALUES ($1, $2) RETURNING id', [1, 'Exam 1']
      );
      expect(console.error).toHaveBeenCalledWith('Error adding the exam Exam 1');
    });
  });

  describe('addQuestion', () => {
    it('should add a question', async () => {
      db.none.mockResolvedValue();

      await addQuestion(1, 4, 'A', 1, 1);

      expect(db.none).toHaveBeenCalledWith(
        'INSERT INTO questions (exam_id, num_options, correct_answer, weight, question_num) VALUES ($1, $2, $3, $4, $5)', [1, 4, 'A', 1, 1]
      );
    });

    it('should handle errors gracefully', async () => {
      db.none.mockRejectedValue(new Error('Database error'));

      await addQuestion(1, 4, 'A', 1, 1);

      expect(db.none).toHaveBeenCalledWith(
        'INSERT INTO questions (exam_id, num_options, correct_answer, weight, question_num) VALUES ($1, $2, $3, $4, $5)', [1, 4, 'A', 1, 1]
      );
      expect(console.error).toHaveBeenCalledWith('Error adding question');
    });
  });

  describe('calculateGrades', () => {
    it('should calculate grades', async () => {
      const mockGrades = [
        { exam_id: 1, course_id: 1, exam_name: 'Exam 1', user_id: 1, last_name: 'Doe', first_name: 'John', student_score: 10 },
        { exam_id: 2, course_id: 1, exam_name: 'Exam 2', user_id: 1, last_name: 'Doe', first_name: 'John', student_score: 20 },
      ];
      db.manyOrNone.mockResolvedValue(mockGrades);

      const result = await calculateGrades(1);

      expect(db.manyOrNone).toHaveBeenCalledWith(
        `WITH
                registeredStudents AS (
	                SELECT user_id AS "userId", users.last_name AS "lastName", users.first_name AS "firstName"
	                FROM users JOIN registration ON users.id = user_id
	                WHERE course_id = 1
            ),

                studentsWithExams AS (
	                SELECT users.id AS "userId", users.last_name AS "lastName", users.first_name AS "firstName",
			            registration.user_Id IS NOT NULL AS "isRegistered",
			            exams.id AS "examId",  exams.name AS "examName",
	    	            SUM(weight*(CASE WHEN response=correct_answer THEN 1 ELSE 0 END))
        		        AS "studentScore"
	                FROM users
			        JOIN responses ON users.id = responses.user_id
			        JOIN questions ON questions.id = question_id
			        JOIN exams ON exams.id = exam_id
			        LEFT JOIN registration ON 
				        responses.user_id = registration.user_id
				        AND registration.course_id = 1
	                WHERE exams.course_id = 1
	                GROUP BY  users.id, users.last_name, users.first_name,
			            exams.id, exams.name, registration.user_Id
            ),

                StudentsWithoutExams AS (
	                SELECT registeredStudents."userId", registeredStudents."lastName",
		                registeredStudents."firstName", 1=1 AS "isRegistered",
		                -1 AS "examId", NULL AS "examName", 0 AS "studentScore"
	                FROM studentsWithExams 
	                RIGHT JOIN registeredStudents ON studentsWithExams."userId" = registeredStudents."userId"
	                WHERE studentsWithExams."userId" IS NULL
            )
            SELECT * FROM StudentsWithoutExams
            UNION
            SELECT * FROM studentsWithExams
            ORDER BY "userId" ASC, "examId" ASC;`
      );
      expect(result).toEqual(mockGrades);
    });

    it('should handle errors gracefully', async () => {
      db.manyOrNone.mockRejectedValue(new Error('Database error'));

      await calculateGrades(1);

      expect(db.manyOrNone).toHaveBeenCalledWith(
        `WITH
                registeredStudents AS (
	                SELECT user_id AS "userId", users.last_name AS "lastName", users.first_name AS "firstName"
	                FROM users JOIN registration ON users.id = user_id
	                WHERE course_id = 1
            ),

                studentsWithExams AS (
	                SELECT users.id AS "userId", users.last_name AS "lastName", users.first_name AS "firstName",
			            registration.user_Id IS NOT NULL AS "isRegistered",
			            exams.id AS "examId",  exams.name AS "examName",
	    	            SUM(weight*(CASE WHEN response=correct_answer THEN 1 ELSE 0 END))
        		        AS "studentScore"
	                FROM users
			        JOIN responses ON users.id = responses.user_id
			        JOIN questions ON questions.id = question_id
			        JOIN exams ON exams.id = exam_id
			        LEFT JOIN registration ON 
				        responses.user_id = registration.user_id
				        AND registration.course_id = 1
	                WHERE exams.course_id = 1
	                GROUP BY  users.id, users.last_name, users.first_name,
			            exams.id, exams.name, registration.user_Id
            ),

                StudentsWithoutExams AS (
	                SELECT registeredStudents."userId", registeredStudents."lastName",
		                registeredStudents."firstName", 1=1 AS "isRegistered",
		                -1 AS "examId", NULL AS "examName", 0 AS "studentScore"
	                FROM studentsWithExams 
	                RIGHT JOIN registeredStudents ON studentsWithExams."userId" = registeredStudents."userId"
	                WHERE studentsWithExams."userId" IS NULL
            )
            SELECT * FROM StudentsWithoutExams
            UNION
            SELECT * FROM studentsWithExams
            ORDER BY "userId" ASC, "examId" ASC;`
      );
      expect(console.error).toHaveBeenCalledWith('Error calculating grades');
    });
  });

  describe('addResponse', () => {
    it('should add a response', async () => {
      const mockQuestionId = { id: 1 };
      db.oneOrNone.mockResolvedValue(mockQuestionId);
      db.none.mockResolvedValue();

      await addResponse(1, 1, 1, 'A');

      expect(db.oneOrNone).toHaveBeenCalledWith(
        'SELECT id FROM questions WHERE exam_id = $1 AND question_num = $2', [1, 1]
      );
      expect(db.none).toHaveBeenCalledWith(
        'INSERT INTO responses (question_id, user_id, response, question_num) VALUES ($1, $2, $3, $4) ON CONFLICT (question_id, user_id) DO UPDATE SET response = excluded.response', [1, 1, 'A', 1]
      );
    });

    it('should handle errors gracefully', async () => {
      db.oneOrNone.mockRejectedValue(new Error('Database error'));

      await addResponse(1, 1, 1, 'A');

      expect(db.oneOrNone).toHaveBeenCalledWith(
        'SELECT id FROM questions WHERE exam_id = $1 AND question_num = $2', [1, 1]
      );
      expect(console.error).toHaveBeenCalledWith('Error adding response');
    });
  });

  describe('addStudentAnswers', () => {
    it('should add student answers', async () => {
      const mockAddResponse = jest.spyOn(require('./userController'), 'addResponse').mockResolvedValue();

      const jsonData = {
        key1: {
          stnum: 1,
          answers: [
            [{ LetterPos: 1, Question: 1 }],
            [],
            []
          ]
        }
      };

      await addStudentAnswers(jsonData, 1);
    });
  });

  describe('addAnswerKey', () => {
    it('should add answer key', async () => {
      const mockAddQuestion = jest.spyOn(require('./userController'), 'addQuestion').mockResolvedValue();

      const jsonData = {
        key1: {
          answers: [
            [{ LetterPos: 1, Question: 1 }],
            [],
            []
          ]
        }
      };

      await addAnswerKey(jsonData, 1);
    });
  });

  describe('deleteTest', () => {
    it('should delete a test', async () => {
      db.none.mockResolvedValue();

      await deleteTest(1);

      expect(db.none).toHaveBeenCalledWith(
        'DELETE FROM exams WHERE id = $1', [1]
      );
    });

    it('should handle errors gracefully', async () => {
      db.none.mockRejectedValue(new Error('Database error'));

      await expect(deleteTest(1)).rejects.toThrow('Database error');

      expect(db.none).toHaveBeenCalledWith(
        'DELETE FROM exams WHERE id = $1', [1]
      );
      expect(console.error).toHaveBeenCalledWith('Error deleting test with id 1:', expect.any(Error));
    });
  });

  describe('editTest', () => {
    it('should edit a test', async () => {
      db.none.mockResolvedValue();

      await editTest(1, 'New Test Name');

      expect(db.none).toHaveBeenCalledWith(
        'UPDATE exams SET name = $1 WHERE id = $2', ['New Test Name', 1]
      );
    });

    it('should handle errors gracefully', async () => {
      db.none.mockRejectedValue(new Error('Database error'));

      await expect(editTest(1, 'New Test Name')).rejects.toThrow('Database error');

      expect(db.none).toHaveBeenCalledWith(
        'UPDATE exams SET name = $1 WHERE id = $2', ['New Test Name', 1]
      );
      expect(console.error).toHaveBeenCalledWith('Error editing test with id 1:', expect.any(Error));
    });
  });
});
