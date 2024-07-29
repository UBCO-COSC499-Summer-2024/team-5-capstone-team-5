// app/frontend/src/components/Modules/ExamModule.js

import React from 'react';
import Bubble from '../BubbleSheet/Bubbles';

const Exam = (props) => {
    const question = props.question;

    const compareAnswers = (correct_answer, responses, weight) => {
        if (!correct_answer || !responses) {
            console.warn("Correct answers or responses are missing.");
            return null; // Indicate that the exam was not checked
        }
        
        if (correct_answer.length !== responses.length) {
            console.warn("Correct answers and responses arrays must be the same length.");
            return null; // Indicate that the exam was not checked
        }
        
        let count = 0;
        for (let i = 0; i < correct_answer.length; i++) {
            if (correct_answer[i] === responses[i]) {
                count += 1;
            }
        }
        return (count / correct_answer.length) * weight;
    };

    const grade = compareAnswers(question.correct_answer, question.response, question.weight);

    return (
        <li key={props.examKey} className="bg-gray-700 m-4 p-2 rounded-lg">
            <h2>Question: {question.question_num}</h2>
            <h2>Number of options: {question.num_options}</h2>
            <h2>Weight: {question.weight}</h2>
            <h2>Correct answers:</h2>
            <Bubble question={question} />
            {grade === null ? (
                <h2 className="text-red-500">This Exam is not being checked by the instructor</h2>
            ) : (
                <h2>Grade: {grade}</h2>
            )}
        </li>
    );
}

export default Exam;
