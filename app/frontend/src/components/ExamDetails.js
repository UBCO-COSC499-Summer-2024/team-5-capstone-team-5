import React, { useCallback, useEffect, useState } from 'react';
import getQuestions from '../hooks/getQuestions';
import { NavLink, useParams } from 'react-router-dom';

const ExamDetails = (props) => {
    const { examId } = useParams();
    const [questions, setQuestions] = useState([]);
    const [response, setResponse] = useState([]);

    const fetchData = useCallback(async () => {
        const data = await getQuestions(examId, props.id);
        console.log(data);
        setQuestions(data.questions);
        const responses = []
        for(let i=0; i < data.length-1; i++) {
            responses.push(data[`response${i}`]);
        }
        setResponse(responses);
        console.log(response);
    }, [examId, props.id]);

    useEffect(() => {
        fetchData();
    }, [examId, fetchData]);

    return (
        <div>
            <ul>
                {questions.map((question, index) => (
                    <li key={index}>
                        <h2>Number of options: {question.num_options}</h2>
                        <h2>Weight: {question.weight}</h2>
                        <h2>Correct answers:</h2>
                        {question.correct_answer.map((answer, answerIndex) => (
                            <p key={answerIndex}>{answer}</p>
                        ))}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default ExamDetails;