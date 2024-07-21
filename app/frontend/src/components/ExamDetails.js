// app/frontend/src/components/ExamDetails.js

import React, { useCallback, useEffect, useState } from 'react';
import getQuestions from '../hooks/getQuestions';
import { useParams, useNavigate } from 'react-router-dom';
import Exam from './Modules/ExamModule';

const ExamDetails = (props) => {
    const { examId } = useParams();
    const navigate = useNavigate();
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

    if (loading) {
        return <div>Loading...</div>
    } else {
        return (
            <div>
                <button
                    onClick={() => navigate(-1)} // Navigate back to the previous page
                    className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
                >
                    Back to Course Details
                </button>
                {questions.length === 0 ? (
                    <h2 className="text-red-500 mx-4">This Exam is not being checked by the instructor</h2>
                ) : (
                    <>
                        <h1 className="mx-4">{questions.length > 0 && (questions[0].course_name + " " + questions[0].exam_name)}</h1>
                        <ul>
                            {questions.map((question, index) => (
                                <Exam question={question} examKey={index} key={index} />
                            ))}
                        </ul>
                    </>
                )}
            </div>
        )
    }
}

export default ExamDetails;
