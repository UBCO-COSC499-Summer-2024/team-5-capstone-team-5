const express = require('express');
const multer = require('multer');
const fs = require('fs');
const { PDFDocument } = require('pdf-lib');
const { 
    getCoursesByUserId, 
    getTestsByCourseId, 
    getRecentExamsByUserId, 
    getQuestionData, 
    getStudentsByCourseId, 
    addCourse, 
    addStudent, 
    deleteTest, 
    editTest, 
    register, 
    addResponse, 
    addAnswerKey, 
    addStudentAnswers, 
    getExamAnswers, 
    calculateGrades, 
    editAnswer,
    getScan,
    getAllUsers,
    changeUserRole,
    getCourseInfo,
 } = require('../controllers/userController');
const { addTest } = require('../controllers/testController'); // Import the testController
const csv = require('csv-parser');
const stream = require('stream');
const { getAllCourses } = require('../controllers/courseController');
//const { getAllUsers, changeUserRole } = require('../controllers/userController'); // 

const router = express.Router();
const upload = multer();

// URL = localhost/api/users/courses/student_id
router.get('/courses/:id', async (req, res) => {
    try {
        const courses = await getCoursesByUserId(req.params.id);
        res.status(200).json(courses);
    } catch(error) {
        res.status(404).json({ error: error.message });
    }
});

// URL = localhost/api/users/tests/course_id
router.get('/tests/:id', async (req, res) => {
    try {
        const tests = await getTestsByCourseId(req.params.id);
        res.status(200).json(tests);
    } catch(error) {
        res.status(404).json({ error: error.message });
    }
});

router.get('/questions/answers/:examId', async (req, res) => {
    if(req.params.examId) {
        try {
            const questions = await getExamAnswers(req.params.examId);
            res.status(200).json(questions);
        } catch(error) {
            res.status(500).json({ error: error.message });
        }
    } else {
        res.status(400).json({error: "examId parameter does not exist"})
    }
});

// URL = localhost/api/users/questions/exam_id
router.get('/questions/:eid&:uid', async (req, res) => {
    if(req.params.uid && req.params.eid) {
        try {
            const questions = await getQuestionData(req.params.uid, req.params.eid);
            res.status(200).json(questions);
        } catch(error) {
            res.status(404).json({ error: error.message });
        }
    }
});

// URL = localhost/api/users/tests/recent/student_id
router.get('/tests/recent/:id', async (req, res) => {
    const id = req.params.id;
    if(id) {
        try {
            const courses = await getRecentExamsByUserId(req.params.id);
            res.status(200).json(courses);
        } catch(error) {
            res.status(404).json({ error: error.message });
        };
    } else {
        res.status(404).json({error: "No id found"});
    }
});

router.post('/courses/add', async (req, res) => {
    const { name, description, end_date, user_id } = req.body;
    if(name && description && end_date && user_id) {
        try {
            const newCourse = await addCourse(user_id, name, description, end_date);
            res.status(200).json(newCourse);
        } catch(error) {
            res.status(500).json({error: error.message});
        }
    } else {
        res.status(400).json({error: "Missing info for adding a course"});
    }
});

router.post('/tests/add', addTest); // Use testController for adding tests

router.delete('/tests/delete/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await deleteTest(id);
        res.status(200).json({ message: `Test with id ${id} deleted successfully` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/tests/edit/:id', async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    try {
        await editTest(id, name);
        console.log("Test name: ",name)
        res.status(200).json({ message: `Test with id ${id} edited successfully` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/courses/students/:id', async (req, res) => {
    try {
        const studentList = await getStudentsByCourseId(req.params.id);
        res.status(200).json(studentList);
    } catch(error) {
        res.status(400).json({error: error.message});
    }
});

  router.post('/tests/answers', upload.single('file'), async (req, res) => {
    const response = await fetch('http://python-cv:8000/upload', {
        method: 'POST',
        body: req.file.buffer,
        headers: {
            'Content-Type': 'application/json',
            'testid': req.headers['testid'],
            'numquestions': req.headers['numquestions']
        }
    });
    const jsonData = await response.json();
    const testid = req.headers['testid'];
    const data = jsonData.data;
    addAnswerKey(data, testid, req.headers['userid']);
    res.status(200).json({message: "This will always pass"});
  });

router.post('/tests/upload', upload.single('file'), async (req, res) => {
    console.log(req.file.buffer)
    const response = await fetch('http://python-cv:8000/upload', {
        method: 'POST',
        body: req.file.buffer,
        headers: {
            'Content-Type': 'application/json',
            'testid': req.headers['testid'],
            'numquestions': req.headers['numquestions']
        }
    });
    const jsonData = await response.json();
    const testid = req.headers['testid'];
    const data = jsonData.data;
    addStudentAnswers(data, testid);
    res.status(200);
  });

  router.put('/responses/edit', async (req, res) =>  {
    console.log(req.body);
    const examId = req.body.exam_id;
    const userId = req.body.student_id;
    const modifiedResponses = req.body.modifiedResponses;
    modifiedResponses.forEach((response) => {
        addResponse(examId, response.questionNum, userId, response.responseArray, true);
    })
    res.status(200);
  });

  router.post('/students/upload', upload.single('file'), async (req, res) => {
    try {
        const bufferStream = new stream.PassThrough();
        bufferStream.end(req.file.buffer);
        // Parse the CSV data from the buffer
        const results = [];
        bufferStream.pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
            console.log('Parsed CSV Data:', results); // This is the parsed CSV data
            results.forEach((student) => {
                console.log("Student",student);
                const id = student.id;
                const first = student.first_name;
                const last = student.last_name;
                const email = student.email;
                const password = student.password || "changeme";
                const courseId = req.headers["courseid"];
                if(id && email) {
                    addStudent(id, first, last, email, password, courseId);
                };
            });
            res.status(200).send('File uploaded and parsed successfully.');
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('An error occurred while processing the file.');
}
  });

router.get('/courses/grades/:id', async (req, res) => {
    const id = req.params.id;
    if(id) {
        try {
            const grades = await calculateGrades(req.params.id);
            res.status(200).json(grades);
        } catch(error) {
            res.status(400).json({error: error.message});
        }
    } else {
        res.status(400).json({error: "id is not sent"});
    }
});

router.post('/questions/answers/edit/:id', async (req, res) => {
    try {
        const questionId = req.params.id;
        const correctAnswer = req.body.correct_answer;
        console.log("Question ID:",questionId)
        console.log("Correct Answers:",correctAnswer);
        await editAnswer(questionId, correctAnswer);
        res.status(200).json({message: 'Answer added successfully'})
    } catch(error) {
        res.status(400).json({error: error.message});
    }
});

router.get('/scans/:examId/:userId', async (req, res) => {
    try {
        const { examId, userId } = req.params
        const path = await getScan(examId, userId);
        console.log(path);
        res.status(200).json({path: path.scan});
    } catch(error) {
        res.status(400).json({error: error.message});
    }
});
//admin
  router.get('/all', async(req, res) =>{
    try{
        const users = await getAllUsers();
        res.status(200).json(users);
    }catch(error){
        console.error('heres the error', error);
        res.status(500).send('an error occoured while getAllUsers')
    }
  });

router.put('/role/:userId', async(req,res) =>{
    const{user_id } = req.params;
    const{role} = req.body;

    try{
    await changeUserRole(user_id,role);
    res.status(200).json({message: 'role updaed succesfully'});

    }catch(error){
    res.status(200).json({message: 'an error occoured while changeUserRole'});
    }
  });


router.get('/courses/info/:id', async (req, res) => {
    try {
        const data = await getCourseInfo(req.params.id);
        res.status(200).json(data);
    } catch(error) {
        res.status(500).json({error: error.message});
    }
})

module.exports = router;
