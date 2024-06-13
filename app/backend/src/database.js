const pgp = require('pg-promise')(/* options */)
const db = pgp({
  host: 'db',
  port: 5432,
  database: 'gradeit',
  user: 'gradeit',
  password: 'cosc499rocks'
});

const userCreationQuery = 
    `CREATE TABLE IF NOT EXISTS USERS (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50),
    email VARCHAR(100),
    password VARCHAR(100)
    );`

const courseCreationQuery = 
    `CREATE TABLE IF NOT EXISTS COURSES (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50),
    description TEXT,
    endDATE DATE
    );`

const examCreationQuery = 
    `CREATE TABLE IF NOT EXISTS EXAMS (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50),
    DATE date,
    visibility BOOLEAN,
    course_id INT,
    FOREIGN KEY (course_id) REFERENCES COURSES(id)
    );`

const questionCreationQuery = 
    `CREATE TABLE IF NOT EXISTS QUESTIONS ( 
    id SERIAL PRIMARY KEY,
    num_options INT,
    correct_answer INT[],
    weight float,
    exam_id INT,
    FOREIGN KEY (exam_id) REFERENCES EXAMS(id)
    );`

const responseCreationQuery =
    `CREATE TABLE IF NOT EXISTS RESPONSES (
    id SERIAL PRIMARY KEY,
    response int[],
    question_id INT,
    user_id INT,
    grade float,
    FOREIGN KEY (question_id) REFERENCES QUESTIONS(id),
    FOREIGN KEY (user_id) REFERENCES USERS(id)
);`

module.exports = { db, responseCreationQuery, questionCreationQuery, courseCreationQuery, examCreationQuery, userCreationQuery };