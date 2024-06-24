import React, { useCallback, useEffect, useState } from 'react';
import getQuestions from '../hooks/getQuestions';
import { NavLink, useParams } from 'react-router-dom';
import Exam from './Modules/ExamModule';

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
                <Exam question={question} key={index} />
                    ))}
            </ul>
        </div>
    )
}

export default ExamDetails;