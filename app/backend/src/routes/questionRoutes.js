const express = require('express');
const router = express.Router();
const {
    addQuestion,
    editAnswer,
    getQuestionData,
    getExamAnswers
} = require('../controllers/questionController');


router.get('/responses/:eid&:uid', async (req, res) => {
    if(req.params.uid && req.params.eid) {
        try {
            const questions = await getQuestionData(req.params.uid, req.params.eid);
            res.status(200).json(questions);
        } catch(error) {
            res.status(404).json({ error: error.message });
        }
    }
});

router.get('/answers/:examId', async (req, res) => {
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

router.post('/edit/:questionId', async (req, res) => {
    try {
        const questionId = req.params.questionId;
        const correctAnswer = req.body.correct_answer;
        console.log("Question ID:",questionId)
        console.log("Correct Answers:",correctAnswer);
        await editAnswer(questionId, correctAnswer);
        res.status(200).json({message: 'Answer added successfully'})
    } catch(error) {
        res.status(400).json({error: error.message});
    }
});

module.exports = router;