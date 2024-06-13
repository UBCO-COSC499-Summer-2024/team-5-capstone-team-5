/*
 * This script CREATEs the necessary tables for the application's database.
 * 
 * Table: users
 * - id: The unique identifier for each user.
 * - first_name: The first name of the user.
 * - last_name: The last name of the user.
 * - email: The email address of the user.
 * - password: The password of the user.
 * - role: The role of the user.
 * 
 * Table: courses
 * - id: The unique identifier for each course.
 * - name: The name of the course.
 * - description: The description of the course.
 * - end_date: The end date of the course.
 * 
 * Table: exams
 * - id: The unique identifier for each exam.
 * - name: The name of the exam.
 * - date_marked: The date of the exam.
 * - visibility: The visibility status of the exam.
 * - course_id: The foreign key referencing the courses table.
 * 
 * Table: questions
 * - id: The unique identifier for each question.
 * - num_options: The number of options for the question.
 * - correct_answer: The correct answer(s) for the question.
 * - weight: The weight of the question in the exam.
 * - exam_id: The foreign key referencing the exams table.
 * 
 * Table: responses
 * - question_id: The foreign key referencing the questions table.
 * - user_id: The foreign key referencing the users table.
 * - response: The response(s) provided by the user.
 * - grade: The grade received for the response.
 */

-- This can be edited out with a comment in the future to make the data persistent
-- Dropped in reverse for dependencies
DROP TABLE IF EXISTS responses;
DROP TABLE IF EXISTS questions;
DROP TABLE IF EXISTS exams;
DROP TABLE IF EXISTS registration;
DROP TABLE IF EXISTS courses;
DROP TABLE IF EXISTS users;


CREATE TABLE IF NOT EXISTS users (
    id serial PRIMARY KEY,
    first_name text,
    last_name text,
    email text NOT NULL UNIQUE,
    password text,
    role integer
);


CREATE TABLE IF NOT EXISTS courses (
    id serial PRIMARY KEY,
    name text,
    description text,
    end_date date
);


CREATE TABLE IF NOT EXISTS registration (
    user_id integer REFERENCES users(id) ON DELETE CASCADE,
    course_id integer REFERENCES courses(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, course_id)
);


CREATE TABLE IF NOT EXISTS exams (
    id serial PRIMARY KEY,
    course_id integer REFERENCES courses(id) ON DELETE CASCADE,
    name text,
    date_marked date,
    visibility boolean
);


CREATE TABLE IF NOT EXISTS questions ( 
    id serial PRIMARY KEY,
    exam_id integer REFERENCES exams(id) ON DELETE CASCADE,
    num_options integer,
    correct_answer integer[],
    weight float
);


CREATE TABLE IF NOT EXISTS responses (
    question_id integer REFERENCES questions(id) ON DELETE CASCADE,
    user_id integer REFERENCES users(id) ON DELETE CASCADE,
    response integer[],
    grade float,
    PRIMARY KEY (question_id, user_id)
);

-- Partially AI-Generated Sample Data

-- User Sample Data
INSERT INTO users (first_name, last_name, email, password, role) VALUES ('Nic', 'Kouwen', 'nk@email.com', 'ilovecosc', 1);
INSERT INTO users (first_name, last_name, email, password, role) VALUES ('Jane', 'Doe', 'janedoe@email.com', 'password123', 1);
INSERT INTO users (first_name, last_name, email, password, role) VALUES ('John', 'Smith', 'johnsmith@email.com', 'securepass456', 1);
INSERT INTO users (first_name, last_name, email, password, role) VALUES ('Alice', 'Johnson', 'alicejohnson@email.com', 'mypassword789', 1);
INSERT INTO users (first_name, last_name, email, password, role) VALUES ('Bob', 'Brown', 'bobbrown@email.com', 'qwerty987', 1);
INSERT INTO users (first_name, last_name, email, password, role) VALUES ('Jay', 'Bhullar', 'jb@email.com', 'ilovecapstone', 2);
INSERT INTO users (first_name, last_name, email, password, role) VALUES ('Nathan', 'JacINTO', 'nj@email.com', 'scottsthebest', 2);
INSERT INTO users (first_name, last_name, email, password, role) VALUES ('Jack', 'Mathisen', 'jm@email.com', 'ilovecosc499', 2);
INSERT INTO users (first_name, last_name, email, password, role) VALUES ('Oakley', 'Pankratz', 'op@email.com', 'math>cosc', 2);

-- Course Sample Data
INSERT INTO courses (name, description, end_date) VALUES ('MATH 100-001', 'Differential Calculus with Applications to Physical Sciences and Engineering', '2025-01-01');
INSERT INTO courses (name, description, end_date) VALUES ('PHYS 101-001', 'Introduction to Physics', '2025-01-01');
INSERT INTO courses (name, description, end_date) VALUES ('CHEM 101-001', 'General Chemistry', '2025-01-01');
INSERT INTO courses (name, description, end_date) VALUES ('BIOL 101-001', 'Introduction to Biology', '2025-01-01');
INSERT INTO courses (name, description, end_date) VALUES ('COMP 101-001', 'Introduction to Computer Science', '2025-01-01');
INSERT INTO courses (name, description, end_date) VALUES ('ECON 101-001', 'Principles of Microeconomics', '2025-01-01');
INSERT INTO courses (name, description, end_date) VALUES ('HIST 101-001', 'World History', '2025-01-01');
INSERT INTO courses (name, description, end_date) VALUES ('PSYC 101-001', 'Introduction to Psychology', '2025-01-01');
INSERT INTO courses (name, description, end_date) VALUES ('ENGL 101-001', 'English Composition', '2025-01-01');

-- Registration Sample Data
-- Users 1-5 registered in 5 courses each
INSERT INTO registration (user_id, course_id) VALUES (1, 1);
INSERT INTO registration (user_id, course_id) VALUES (1, 2);
INSERT INTO registration (user_id, course_id) VALUES (1, 3);
INSERT INTO registration (user_id, course_id) VALUES (1, 4);
INSERT INTO registration (user_id, course_id) VALUES (1, 5);

INSERT INTO registration (user_id, course_id) VALUES (2, 1);
INSERT INTO registration (user_id, course_id) VALUES (2, 6);
INSERT INTO registration (user_id, course_id) VALUES (2, 7);
INSERT INTO registration (user_id, course_id) VALUES (2, 8);
INSERT INTO registration (user_id, course_id) VALUES (2, 9);

INSERT INTO registration (user_id, course_id) VALUES (3, 2);
INSERT INTO registration (user_id, course_id) VALUES (3, 3);
INSERT INTO registration (user_id, course_id) VALUES (3, 4);
INSERT INTO registration (user_id, course_id) VALUES (3, 5);
INSERT INTO registration (user_id, course_id) VALUES (3, 6);

INSERT INTO registration (user_id, course_id) VALUES (4, 1);
INSERT INTO registration (user_id, course_id) VALUES (4, 2);
INSERT INTO registration (user_id, course_id) VALUES (4, 7);
INSERT INTO registration (user_id, course_id) VALUES (4, 8);
INSERT INTO registration (user_id, course_id) VALUES (4, 9);

INSERT INTO registration (user_id, course_id) VALUES (5, 3);
INSERT INTO registration (user_id, course_id) VALUES (5, 4);
INSERT INTO registration (user_id, course_id) VALUES (5, 5);
INSERT INTO registration (user_id, course_id) VALUES (5, 6);
INSERT INTO registration (user_id, course_id) VALUES (5, 7);

-- Users 6-9 included in each course
INSERT INTO registration (user_id, course_id) VALUES (6, 1);
INSERT INTO registration (user_id, course_id) VALUES (7, 2);
INSERT INTO registration (user_id, course_id) VALUES (8, 3);
INSERT INTO registration (user_id, course_id) VALUES (9, 4);

INSERT INTO registration (user_id, course_id) VALUES (6, 5);
INSERT INTO registration (user_id, course_id) VALUES (7, 6);
INSERT INTO registration (user_id, course_id) VALUES (8, 7);
INSERT INTO registration (user_id, course_id) VALUES (9, 8);

INSERT INTO registration (user_id, course_id) VALUES (6, 9);

-- Exams Sample Data
-- Course ID 1
INSERT INTO exams (name, date_marked, visibility, course_id) VALUES ('Midterm 1', '2024-10-15', true, 1); -- Assuming course 1 will be MATH 100-001
INSERT INTO exams (name, date_marked, visibility, course_id) VALUES ('Evaluation Quiz', '2024-09-15', true, 1);
INSERT INTO exams (name, date_marked, visibility, course_id) VALUES ('Midterm 2', '2024-11-15', true, 1);
INSERT INTO exams (name, date_marked, visibility, course_id) VALUES ('Final Exam', '2024-12-25', true, 1); -- Yes, I know this is on Christmas.

-- Course ID 2
INSERT INTO exams (name, date_marked, visibility, course_id) VALUES ('Midterm 1', '2024-10-15', true, 2);
INSERT INTO exams (name, date_marked, visibility, course_id) VALUES ('Evaluation Quiz', '2024-09-15', true, 2);
INSERT INTO exams (name, date_marked, visibility, course_id) VALUES ('Midterm 2', '2024-11-15', true, 2);
INSERT INTO exams (name, date_marked, visibility, course_id) VALUES ('Final Exam', '2024-12-25', true, 2);

-- Course ID 3
INSERT INTO exams (name, date_marked, visibility, course_id) VALUES ('Midterm 1', '2024-10-15', true, 3);
INSERT INTO exams (name, date_marked, visibility, course_id) VALUES ('Evaluation Quiz', '2024-09-15', true, 3);
INSERT INTO exams (name, date_marked, visibility, course_id) VALUES ('Midterm 2', '2024-11-15', true, 3);
INSERT INTO exams (name, date_marked, visibility, course_id) VALUES ('Final Exam', '2024-12-25', true, 3);

-- Course ID 4
INSERT INTO exams (name, date_marked, visibility, course_id) VALUES ('Midterm 1', '2024-10-15', true, 4);
INSERT INTO exams (name, date_marked, visibility, course_id) VALUES ('Evaluation Quiz', '2024-09-15', true, 4);
INSERT INTO exams (name, date_marked, visibility, course_id) VALUES ('Midterm 2', '2024-11-15', true, 4);
INSERT INTO exams (name, date_marked, visibility, course_id) VALUES ('Final Exam', '2024-12-25', true, 4);

-- Course ID 5
INSERT INTO exams (name, date_marked, visibility, course_id) VALUES ('Midterm 1', '2024-10-15', true, 5);
INSERT INTO exams (name, date_marked, visibility, course_id) VALUES ('Evaluation Quiz', '2024-09-15', true, 5);
INSERT INTO exams (name, date_marked, visibility, course_id) VALUES ('Midterm 2', '2024-11-15', true, 5);
INSERT INTO exams (name, date_marked, visibility, course_id) VALUES ('Final Exam', '2024-12-25', true, 5);

-- Course ID 6
INSERT INTO exams (name, date_marked, visibility, course_id) VALUES ('Midterm 1', '2024-10-15', true, 6);
INSERT INTO exams (name, date_marked, visibility, course_id) VALUES ('Evaluation Quiz', '2024-09-15', true, 6);
INSERT INTO exams (name, date_marked, visibility, course_id) VALUES ('Midterm 2', '2024-11-15', true, 6);
INSERT INTO exams (name, date_marked, visibility, course_id) VALUES ('Final Exam', '2024-12-25', true, 6);

-- Course ID 7
INSERT INTO exams (name, date_marked, visibility, course_id) VALUES ('Midterm 1', '2024-10-15', true, 7);
INSERT INTO exams (name, date_marked, visibility, course_id) VALUES ('Evaluation Quiz', '2024-09-15', true, 7);
INSERT INTO exams (name, date_marked, visibility, course_id) VALUES ('Midterm 2', '2024-11-15', true, 7);
INSERT INTO exams (name, date_marked, visibility, course_id) VALUES ('Final Exam', '2024-12-25', true, 7);

-- Course ID 8
INSERT INTO exams (name, date_marked, visibility, course_id) VALUES ('Midterm 1', '2024-10-15', true, 8);
INSERT INTO exams (name, date_marked, visibility, course_id) VALUES ('Evaluation Quiz', '2024-09-15', true, 8);
INSERT INTO exams (name, date_marked, visibility, course_id) VALUES ('Midterm 2', '2024-11-15', true, 8);
INSERT INTO exams (name, date_marked, visibility, course_id) VALUES ('Final Exam', '2024-12-25', true, 8);

-- Course ID 9
INSERT INTO exams (name, date_marked, visibility, course_id) VALUES ('Midterm 1', '2024-10-15', true, 9);
INSERT INTO exams (name, date_marked, visibility, course_id) VALUES ('Evaluation Quiz', '2024-09-15', true, 9);
INSERT INTO exams (name, date_marked, visibility, course_id) VALUES ('Midterm 2', '2024-11-15', true, 9);
INSERT INTO exams (name, date_marked, visibility, course_id) VALUES ('Final Exam', '2024-12-25', true, 9);

-- Questions Sample Data
-- Exam 1: MATH 100 Midterm 1
INSERT INTO questions (num_options, correct_answer, weight, exam_id) VALUES (5, '{1}', 1, 1);
INSERT INTO questions (num_options, correct_answer, weight, exam_id) VALUES (5, '{3}', 1, 1);
INSERT INTO questions (num_options, correct_answer, weight, exam_id) VALUES (5, '{4}', 1, 1);
INSERT INTO questions (num_options, correct_answer, weight, exam_id) VALUES (5, '{1, 2}', 2, 1);
-- Exam 2: MATH 100 Evaluation Quiz
INSERT INTO questions (num_options, correct_answer, weight, exam_id) VALUES (5, '{5}', 1, 2);
INSERT INTO questions (num_options, correct_answer, weight, exam_id) VALUES (5, '{2}', 1, 2);
INSERT INTO questions (num_options, correct_answer, weight, exam_id) VALUES (5, '{4}', 1, 2);
INSERT INTO questions (num_options, correct_answer, weight, exam_id) VALUES (5, '{3, 5}', 2, 2);
-- Exam 3: MATH 100 Midterm 2
INSERT INTO questions (num_options, correct_answer, weight, exam_id) VALUES (5, '{2}', 1, 3);
INSERT INTO questions (num_options, correct_answer, weight, exam_id) VALUES (5, '{5}', 1, 3);
INSERT INTO questions (num_options, correct_answer, weight, exam_id) VALUES (5, '{3}', 1, 3);
INSERT INTO questions (num_options, correct_answer, weight, exam_id) VALUES (5, '{2, 4}', 2, 3);
-- Exam 4: MATH 100 Final Exam
INSERT INTO questions (num_options, correct_answer, weight, exam_id) VALUES (5, '{1}', 1, 4);
INSERT INTO questions (num_options, correct_answer, weight, exam_id) VALUES (5, '{3}', 1, 4);
INSERT INTO questions (num_options, correct_answer, weight, exam_id) VALUES (5, '{4}', 1, 4);
INSERT INTO questions (num_options, correct_answer, weight, exam_id) VALUES (5, '{1, 2}', 2, 4);

-- Responses Sample Data
-- Responses for questions on Midterm 1
INSERT INTO responses (question_id, user_id, response) VALUES (1, 1, '{1}'); --Responded with 1, should grade correct.
INSERT INTO responses (question_id, user_id, response) VALUES (2, 1, '{3}');
INSERT INTO responses (question_id, user_id, response) VALUES (3, 1, '{1}');
INSERT INTO responses (question_id, user_id, response) VALUES (4, 1, '{1, 2}');
-- Responses for questions on Evaluation Quiz
INSERT INTO responses (question_id, user_id, response) VALUES (5, 1, '{5}');
INSERT INTO responses (question_id, user_id, response) VALUES (6, 1, '{2}');
INSERT INTO responses (question_id, user_id, response) VALUES (7, 1, '{4}');
INSERT INTO responses (question_id, user_id, response) VALUES (8, 1, '{1, 5}');
-- Responses for questions on Midterm 2
INSERT INTO responses (question_id, user_id, response) VALUES (9, 1, '{2}');
INSERT INTO responses (question_id, user_id, response) VALUES (10, 1, '{5}');
INSERT INTO responses (question_id, user_id, response) VALUES (11, 1, '{4}');
INSERT INTO responses (question_id, user_id, response) VALUES (12, 1, '{2, 4}');
-- Responses for questions on Final Exam
INSERT INTO responses (question_id, user_id, response) VALUES (13, 1, '{1}');
INSERT INTO responses (question_id, user_id, response) VALUES (14, 1, '{3}');
INSERT INTO responses (question_id, user_id, response) VALUES (15, 1, '{1}');
INSERT INTO responses (question_id, user_id, response) VALUES (16, 1, '{1, 2}');