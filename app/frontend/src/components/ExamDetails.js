// app/frontend/src/components/ExamDetails.js

import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../App'; // Assuming useTheme is available at this path
import Bubble from './BubbleSheet/Bubbles'; // Ensure this path is correct
import getQuestions from '../hooks/getQuestions';

const ExamDetails = (props) => {
    const { examId } = useParams();
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const { theme } = useTheme();

    const fetchData = useCallback(async () => {
        const data = await getQuestions(examId, props.id);
        console.log(data);

        // Calculate grade for each question safely
        const calculatedQuestions = data.map(question => {
            const correctCount = question.correct_answers ? question.correct_answers.length : 0;
            const responseCount = question.response ? question.response.filter(ans => question.correct_answers && question.correct_answers.includes(ans)).length : 0;
            const grade = (responseCount === correctCount && question.response.length === correctCount) ? 1 : 0;
            return { ...question, grade };
        });

        setQuestions(calculatedQuestions);
        setLoading(false);
    }, [examId, props.id]);

    useEffect(() => {
        fetchData();
    }, [examId, fetchData]);

    if (loading) {
        return <div>Loading...</div>;
    } else {
        return (
            <div className={`p-4 flex flex-col min-h-screen ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'}`}>
                <button
                    onClick={() => navigate(-1)} // Navigate back to the previous page
                    className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
                >
                    Back to Course Details
                </button>
                <h1 className="mx-4">{questions.length > 0 && (questions[0].course_name + " " + questions[0].exam_name)}</h1>
                <div className="flex-grow overflow-x-auto">
                    <table className="w-full min-w-[800px] text-left border-separate" style={{ borderSpacing: '0 10px' }}>
                        <thead>
                            <tr>
                                <th className={`p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-300 text-black'}`}>Question</th>
                                <th className={`p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-300 text-black'}`}>Number of Options</th>
                                <th className={`p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-300 text-black'}`}>Weight</th>
                                <th className={`p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-300 text-black'}`}>Correct Answers</th>
                                <th className={`p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-300 text-black'}`}>Grade</th>
                            </tr>
                        </thead>
                        <tbody>
                            {questions.map((question, index) => (
                                <tr key={index} className="cursor-pointer">
                                    <td className={`p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-300 text-black'}`}>{`Question: ${index + 1}`}</td>
                                    <td className={`p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-300 text-black'}`}>{question.num_options}</td>
                                    <td className={`p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-300 text-black'}`}>{question.weight}</td>
                                    <td className={`p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-300 text-black'}`}>
                                        <Bubble question={question} theme={theme} />
                                    </td>
                                    <td className={`p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-300 text-black'}`}>{question.grade}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

export default ExamDetails;
