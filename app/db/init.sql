
/*
 * This script creates the necessary tables for the application's database.
 * 
 * Table: USERS
 * - id: The unique identifier for each user.
 * - name: The name of the user.
 * - email: The email address of the user.
 * - password: The password of the user.
 * 
 * Table: COURSES
 * - id: The unique identifier for each course.
 * - name: The name of the course.
 * - description: The description of the course.
 * - endDate: The end date of the course.
 * 
 * Table: EXAMS
 * - id: The unique identifier for each exam.
 * - date: The date of the exam.
 * - visibility: The visibility status of the exam.
 * - course_id: The foreign key referencing the COURSES table.
 * 
 * Table: QUESTIONS
 * - id: The unique identifier for each question.
 * - num_options: The number of options for the question.
 * - correct_answer: The correct answer(s) for the question.
 * - notes: Additional notes for the question.
 * - weight: The weight of the question in the exam.
 * - exam_id: The foreign key referencing the EXAMS table.
 /*
 
 / * Table: RESPONSES
 * - id: The unique identifier for each response.
 * - response: The response(s) provided by the user.
 * - question_id: The foreign key referencing the QUESTIONS table.
 * - grade: The grade received for the response.
 */
*/


CREATE TABLE IF NOT EXISTS USERS (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50),
    email VARCHAR(100),
    password VARCHAR(100)
);
 

create TABLE IF NOT EXISTS COURSES (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50),
    description VARCHAR(100),
    endDATE DATE
);


create  TABLE IF NOT EXISTS EXAMS (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50),
    date DATE,
    visibility BOOLEAN,
    course_id INT,
    FOREIGN KEY (course_id) REFERENCES COURSES(id) ON DELETE CASCADE
);



create TABLE IF NOT EXISTS QUESTIONS ( 
    id SERIAL PRIMARY KEY,
    num_options INT,
    correct_answer INT[],
    weight FLOAT,
    exam_id INT,
    FOREIGN KEY (exam_id) REFERENCES EXAMS(id) ON DELETE CASCADE
);

create TABLE IF NOT EXISTS RESPONSES (
    id SERIAL PRIMARY KEY,
    response int[],
    question_id INT,
    user_id INT,
    grade FLOAT,
    FOREIGN KEY (question_id) REFERENCES QUESTIONS(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES USERS(id) ON DELETE CASCADE
);


/*--insert sample data into courses table
insert  COURSE (name, description, endDATE) values ('Mathematics', 'Introduction to Mathematics', '2021-12-31');
insert  COURSE (name, description, endDATE) values ('Science', 'Introduction to Science', '2021-12-31');
insert  COURSE (name, description, endDATE) values ('History', 'Introduction to History', '2021-12-31');
insert COURSE (name, description, endDATE) values ('English', 'Introduction to English', '2021-12-31');


--insert sample data into exams table
insert EXAMS (name, DATE, visibility, course_id) values ('Math Exam 1', '2021-10-01', true, 1);
insert EXAMS (name, DATE, visibility, course_id) values ('Science Exam 1', '2021-10-01', true, 2);
insert EXAMS (name, DATE, visibility, course_id) values ('Science Exam 2', '2021-10-02', true, 2);
insert EXAMS (name, DATE, visibility, course_id) values ('Science Exam 3', '2021-10-03', true, 2);
insert EXAMS (name, DATE, visibility, course_id) values ('History Exam 1', '2021-10-01', true, 3);

insert QUESTIONS (num_options, correct_answer, notes, weight, exam_id) values (4, '{1,2}', 'Question 1', 0.5, 1);
insert QUESTIONS (num_options, correct_answer, notes, weight, exam_id) values (4, '{1,2}', 'Question 2', 0.5, 1);
insert QUESTIONS (num_options, correct_answer, notes, weight, exam_id) values (4, '{1,2}', 'Question 3', 0.5, 1);

insert RESPONSES (response, question_id, user_id, grade) values ('1,2', 1, 1, 0.5);
insert RESPONSES (response, question_id, user_id, grade) values ('1,2', 2, 1, 0.5);


--insert  sample data into questions table
*/






