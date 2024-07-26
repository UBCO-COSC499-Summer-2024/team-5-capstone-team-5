import React, { useCallback, useEffect, useState } from 'react';
import getQuestions from '../hooks/getQuestions';
import { NavLink, useParams } from 'react-router-dom';
import Exam from './Modules/ExamModule';

const ExamDetails = (props) => {
    const { examId } = useParams();
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        const data = await getQuestions(examId, props.id);
        console.log(data);
        setQuestions(data);
        setLoading(false);
    }, [examId, props.id]);

    useEffect(() => {
        fetchData();
    }, [examId, fetchData]);

    if(loading) {
        return <div>Loading...</div>
    } else {
        return (
            <div>
                <h1 className="mx-4">{questions.length > 0 && (questions[0].course_name + " " + questions[0].exam_name)}</h1>
                <ul>
                {questions.map((question, index) => (
                    <Exam question={question} key={index} />
                        ))}
                </ul>
            </div>
        )
    }
}

export default ExamDetails;