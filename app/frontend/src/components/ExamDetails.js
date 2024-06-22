import React, { useCallback, useEffect, useState } from 'react';
import getQuestions from '../hooks/getQuestions';
import { NavLink, useParams } from 'react-router-dom';

const ExamDetails = (props) => {
    const { examId } = useParams();
    const [questions, setQuestions] = useState([]);

    const fetchData = useCallback(async () => {
        const data = await getQuestions(examId, props.id);
        console.log(data);
        setQuestions(data);
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
                            <span key={answerIndex}>{answer} </span>
                        ))};
                        <h2>Responses: {question.response.map((responded, respondedIndex) => {
                            <span key={respondedIndex}>{responded} </span>
                        })}</h2>
                        <h2>Grade: {question.grade}</h2>
                    </li>
                ))};
            </ul>
        </div>
    )
}

export default ExamDetails;