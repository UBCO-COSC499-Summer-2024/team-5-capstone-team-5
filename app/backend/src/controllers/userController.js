const { db } = require('../database');
const fs = require('fs');
const path = require('path');

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

const getTestsByCourseId = async (id) => {
    try {
        const response = await db.manyOrNone(
            'SELECT exams.id, date_marked, exams.name, courses.name AS course_name FROM exams JOIN courses ON exams.course_id = courses.id WHERE course_id = $1 ORDER BY date_marked DESC', [id]
        );
        return response;
    } catch(error) {
        console.error(`Error getting course data for id ${id}`,error);
    };
};

const getRecentExamsByUserId = async (id) => {
    try {
        const response = await db.manyOrNone(
            'SELECT exams.id, date_marked, exams.name, courses.name AS course_name FROM users INNER JOIN registration ON users.id = registration.user_id INNER JOIN courses ON registration.course_id = courses.id INNER JOIN exams ON courses.id = exams.course_id WHERE users.id = $1 ORDER BY date_marked DESC', [id]
        );
        return response;
    } catch(error) {
        console.log(`Error getting recent courses for user id ${id}`,error);
    }
}

const getQuestionData = async (userId, examId) => {
    try {
        const response = await db.manyOrNone(
            `SELECT 
                r.question_id, 
                r.user_id, 
                r.response, 
                r.grade, 
                q.num_options, 
                q.correct_answer, 
                q.question_num, 
                q.weight, 
                c.name AS course_name, 
                e.name AS exam_name, 
                r.was_modified, 
                f.issue 
            FROM 
                responses r 
            LEFT JOIN 
                flags f ON f.question_id = r.question_id AND f.user_id = r.user_id
            LEFT JOIN 
                questions q ON r.question_id = q.id 
            LEFT JOIN 
                exams e ON q.exam_id = e.id 
            LEFT JOIN 
                courses c ON e.course_id = c.id 
            WHERE 
                e.id = $1 
                AND r.user_id = $2 
            ORDER BY 
                q.question_num;
            `, [examId, userId]
        );
        return response;
    } catch(error) {
        console.log('Error getting responses for exam',examId,'and user',userId);
    }
}

const getExamAnswers = async (examId) => {
    try {
        const response = await db.manyOrNone(
            'SELECT id AS question_id, correct_answer, weight, question_num, num_options FROM questions WHERE exam_id = $1 ORDER BY question_num', [examId]
        );
        return response;
    } catch(error) {
        console.log('Error getting questions for exam', examId, error);
    }
}

const getStudentsByCourseId = async (courseId) => {
    try {
        const response = await db.manyOrNone(
            'SELECT u.id, u.first_name, u.last_name, u.role FROM users u JOIN registration r ON u.id = r.user_id JOIN courses c ON r.course_id = c.id WHERE c.id = $1 ORDER BY last_name ASC, first_name ASC', [courseId]
        );
        return response;
    } catch(error) {
        console.log('Error getting students for course:',courseId);
    }
}

const addStudent = async (id, first, last, email, password, courseId) => {
    try {
        await db.none(
            'INSERT INTO users (id, first_name, last_name, email, password, role) VALUES ($1, $2, $3, $4, $5, 1) ON CONFLICT (email) DO NOTHING', [id, first, last, email, password]
        );
        if(courseId) {
            register(id, courseId)
        }
    } catch(error) {
        console.error(`Error adding student ${first}, ${last}`);
    };
};

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

const register = async (userId, courseId) => {
    try {
        await db.none(
            'INSERT INTO registration (user_id, course_id) VALUES ($1, $2) ON CONFLICT (user_id, course_id) DO NOTHING', [userId, courseId]
        )
    } catch(error) {
        console.error('Error registering user with ID ', userId, "into course with ID", courseId)
    }
}

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

const addQuestion = async (exam_id, num_options, correct_answer, weight, question_num) => {
    try {
        await db.none(
            `INSERT INTO questions (exam_id, num_options, correct_answer, weight, question_num)
             VALUES ($1, $2, $3, $4, $5)
             ON CONFLICT (exam_id, question_num)
             DO UPDATE SET
                num_options = EXCLUDED.num_options,
                correct_answer = EXCLUDED.correct_answer,
                weight = EXCLUDED.weight`, 
            [exam_id, num_options, correct_answer, weight, question_num]
        );
    } catch (error) {
        console.error(`Error adding or updating question: ${error.message}`);
    }
};

const addScan = async (exam_id, user_id, path) => {
    try {
        await db.none(
            'INSERT INTO scans (exam_id, user_id, scan) VALUES ($1, $2, $3)', [exam_id, user_id, path]
        );
    } catch(error) {
        console.error('Error adding scan for user',user_id);
    }
};

const getScan = async (exam_id, user_id) => {
    try {
        response = await db.oneOrNone(
            'SELECT scan FROM scans WHERE exam_id = $1 AND user_id = $2', [exam_id, user_id]
        );
        return response;
    } catch(error) {
        console.error('Error getting scan for user',user_id,'and exam',exam_id);
        throw error;
    }
};

const calculateGrades = async (courseId) => {
    try {
        const grades = await db.manyOrNone(
           `WITH
                registeredStudents AS (
	                SELECT user_id AS "userId", users.last_name AS "lastName", users.first_name AS "firstName"
	                FROM users JOIN registration ON users.id = user_id
	                WHERE course_id = ${courseId} AND users.role = 1
            ),

                studentsWithExams AS (
	                SELECT users.id AS "userId", users.last_name AS "lastName", users.first_name AS "firstName",
			            registration.user_Id IS NOT NULL AS "isRegistered",
			            exams.id AS "examId",  exams.name AS "examName",
	    	            SUM(weight*(CASE WHEN response=correct_answer THEN 1 ELSE 0 END))
        		        AS "studentScore", SUM(weight) AS "maxScore"
	                FROM users
			        JOIN responses ON users.id = responses.user_id
			        JOIN questions ON questions.id = question_id
			        JOIN exams ON exams.id = exam_id
			        LEFT JOIN registration ON 
				        responses.user_id = registration.user_id
				        AND registration.course_id = ${courseId}
	                WHERE exams.course_id = ${courseId} AND users.role = 1
	                GROUP BY  users.id, users.last_name, users.first_name,
			            exams.id, exams.name, registration.user_Id
            ),

                StudentsWithoutExams AS (
	                SELECT registeredStudents."userId", registeredStudents."lastName",
		                registeredStudents."firstName", 1=1 AS "isRegistered",
		                -1 AS "examId", NULL AS "examName", 0 AS "studentScore",  1 AS "maxScore"
	                FROM studentsWithExams 
	                RIGHT JOIN registeredStudents ON studentsWithExams."userId" = registeredStudents."userId"
	                WHERE studentsWithExams."userId" IS NULL
            )
            SELECT * FROM StudentsWithoutExams
            UNION
            SELECT * FROM studentsWithExams
            ORDER BY "userId" ASC, "examId" ASC;`
        );
        if (grades.length > 0) {
            return grades;
        } else  {
            //maybe should be using getStudentsByCourseId?
            const courseStudents = await db.manyOrNone(
               `SELECT user_id AS "userId", users.last_name AS "lastName", users.first_name AS "firstName"
                FROM users JOIN registration ON id = user_id
                WHERE course_id = ${courseId};`
            );
            return courseStudents;
        }
    } catch(error) {
        console.error(`Error calculating grades`);
    };
};

const addResponse = async (exam_id, question_num, user_id, response, modifying = false) => {
    try {
        questionId = await db.oneOrNone(
            'SELECT id FROM questions WHERE exam_id = $1 AND question_num = $2', [exam_id, question_num]
        );
        if(questionId.id) {
            await db.none(
                'INSERT INTO responses (question_id, user_id, response, question_num, was_modified) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (question_id, user_id) DO UPDATE SET response = excluded.response, was_modified = excluded.was_modified', [questionId.id, user_id, response, question_num, modifying] 
            )
        } else {

        }
    } catch(error) {
        console.error('Error adding response')
    }
}

const flagResponse = async (examId, userId, questionNum, flagText) => {
    console.log(examId, userId, questionNum, flagText)
    try {
        questionId = await db.oneOrNone(
            'SELECT id FROM questions WHERE exam_id = $1 AND question_num = $2', [examId, questionNum]
        );
        if(questionId.id) {
            await db.none(
                'INSERT INTO flags (exam_id, question_id, user_id, issue) VALUES ($1, $2, $3, $4)', [examId, questionId.id, userId, flagText]
            );
        }
    } catch(error) {
        console.error('Error adding response');
    }
}

const flagExam = async (examId, flagText) => {
    try {
        await db.none(
            'INSERT INTO flags (exam_id, issue) VALUES ($1, $2)', [examId, flagText]
        );
    } catch(error) {
        console.error('Error flagging exam',examId)
    }
}

const resolveFlag = async (flagId) => {
    try {
        const response = await db.oneOrNone(
            'DELETE FROM flags WHERE id = $1 RETURNING id', [flagId]
        );

        if (!response) {
            throw new Error('No flag found with the provided ID');
        }

        return response;
    } catch (error) {
        console.error('Error resolving flag:', error.message);
        throw new Error('Failed to resolve flag: ' + error.message);
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

const deleteTest = async (testId) => {
    try {
        await db.none('DELETE FROM exams WHERE id = $1', [testId]);
    } catch (error) {
        console.error(`Error deleting test with id ${testId}:`, error);
        throw error;
    }
};

const deleteResponses = async (userId, examId) => {
    try {
        await db.none(`DELETE 
        FROM responses 
        WHERE 
            question_id IN (
                SELECT
                    questions.id 
                FROM 
                    questions 
                WHERE
                    exam_id = ${examId}
            )
            AND user_id = ${userId};`);
    } catch(error) {
        console.error(`Error deleting responses for user: ${userId} on exam ${examId}`);
        throw error;
    }
}

const editTest = async (testId, newName) => {
    try {
        await db.none('UPDATE exams SET name = $1 WHERE id = $2', [newName, testId]);
    } catch (error) {
        console.error(`Error editing test with id ${testId}:`, error);
        throw error;
    }
};
//For Admin
const getAllUsers = async() =>  { 
    try{
        const users = await db.manyOrNone('SELECT id, first_name, last_name, email, role FROM users ORDER BY role DESC, last_name');
        return users;

    }catch(error){
        console.error('Error Fetching Users:', error);
        throw error;
    }
}

const changeUserRole = async(userId, role) => {
    try{
        await db.none('UPDATE users SET role = $1 WHERE id = $2', [role, userId]);
        return true;
    }catch(error){
        console.log('Error when updating role', error);
        throw error;
    }
}
const getUserStatistics = async () => {
    try {
      const statistics = await db.any('SELECT role, COUNT(*) as count FROM users GROUP BY role');
      return statistics;
    } catch (error) {
      console.error('Error fetching user statistics:', error);
      throw error;
    }
  };

const editAnswer = async (questionId, correctAnswer) => {
    try {
        await db.none('UPDATE questions SET correct_answer = $1 WHERE id = $2', [correctAnswer, questionId]);
    } catch(error) {
        console.error('Error updating answer for quesiton',questionId);
        throw error;
    }
};

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

const getFlagged = async (userId) => {
    try {
        const response = await db.manyOrNone(
            `SELECT 
                flags.id, 
                flags.exam_id, 
                flags.user_id, 
                flags.issue, 
                exams.name AS exam_name, 
                courses.name AS course_name, 
                questions.question_num 
            FROM 
                flags
            LEFT JOIN 
                questions ON flags.question_id = questions.id
            LEFT JOIN 
                exams ON flags.exam_id = exams.id
            LEFT JOIN 
                courses ON exams.course_id = courses.id
            LEFT JOIN 
                registration ON courses.id = registration.course_id
            LEFT JOIN 
                users ON registration.user_id = users.id
            WHERE 
                flags.issue IS NOT NULL AND 
                (users.id = $1 OR users.id IS NULL) AND 
                users.role = 2`, [userId]
        );
        return response;
    } catch(error) {
        console.error('Error getting flagged responses for instructor', userId);
    }
}

module.exports = {
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
    getExamAnswers,
    addScan,
    getAllUsers,
    changeUserRole,
    calculateGrades,
    addResponse,
    getUserStatistics,
    editAnswer,
    getScan,
    getCourseInfo,
    setExamMarked,
    flagResponse,
    getFlagged,
    resolveFlag,
    deleteResponses
}