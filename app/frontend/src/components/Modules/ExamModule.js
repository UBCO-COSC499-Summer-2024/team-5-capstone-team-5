import React from 'react';
import Bubble from '../BubbleSheet/Bubbles';

const Exam = (props) => {
    const question = props.question;

    const compareAnswers = (correct_answer, responses, weight) => {
        let count = 0;
        for(let i = 0; i < correct_answer.length; i++) {
            if(responses[i] in correct_answer) {
                count+= 1/weight;
            }
        }
        return count;
    }


    return(
        <li key={props.key} className="bg-gray-700 m-4 p-2 rounded-lg">
            <h2>Question: {question.question_num}</h2>
            <h2>Number of options: {question.num_options}</h2>
            <h2>Weight: {question.weight}</h2>
            <h2>Correct answers:</h2>
            <Bubble question={question} />
            <h2>Grade: {compareAnswers(question.correct_answer, question.response, question.weight)*question.weight}</h2> {/* Not sure if this makes sense? Dividing weight in function, then multiplying weight after calculation */}
        </li>
    );
}

export default Exam;