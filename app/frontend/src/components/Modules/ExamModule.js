import React from 'react';
import Bubble from '../BubbleSheet/Bubbles';

const Exam = (props) => {
    const question = props.question;

    const compareAnswers = (correct_answer, responses, weight) => {
        if(correct_answer.length !== responses.length) {
            throw new Error("Arrays must be the same length (answers and responses)");
        }
        let count = 0;
        for(let i = 0; i < correct_answer.length; i++) {
            if(correct_answer[i] === responses[i]) {
                count+= 1/weight;
            }
        }
        return count;
    }

    
    return(
        <li key={props.key} className="bg-gray-700 m-4 p-2 rounded-lg">
            <h2>Number of options: {question.num_options}</h2>
            <h2>Weight: {question.weight}</h2>
            <h2>Correct answers:</h2>
            {question.correct_answer.map((answer, answerIndex) => (
                <Bubble question={answerIndex} />
            ))}
            <h2>Responses: </h2>
            {question.response.map((responded, respondedIndex) => (
                <Bubble question={respondedIndex} />
            ))}
            <h2>Grade: {compareAnswers(question.correct_answer, question.response, question.weight)*question.weight}</h2> {/* Not sure if this makes sense? Dividing weight in function, then multiplying weight after calculation */}
        </li>
    );
}

export default Exam;