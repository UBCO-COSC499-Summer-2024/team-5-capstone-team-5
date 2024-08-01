import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../App'; // Assuming useTheme is available at this path
import Bubble from './BubbleSheet/Bubbles'; // Ensure this path is correct
import getQuestions from '../hooks/getQuestions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFlag } from '@fortawesome/free-solid-svg-icons';
import Modal from './issueModal'; // Ensure this path is correct

const ExamDetails = (props) => {
    const { examId } = useParams();
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const { theme } = useTheme();
    const [showModal, setShowModal] = useState(false);
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [issue, setIssue] = useState('');

    const fetchData = useCallback(async () => {
        const data = await getQuestions(examId, props.id);
        console.log('Total questions fetched:', data.length);
        setQuestions(data);
        setLoading(false);
    }, [examId, props.id]);

    useEffect(() => {
        fetchData();
    }, [examId, fetchData]);

    useEffect(() => {
        fetchImageUrl(examId, props.id).then((path) => displayImage(path));
    }, [loading]);

    const handleFlagClick = (question) => {
        setSelectedQuestion(question);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setIssue('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await fetch('http://localhost/api/flags/set', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                examId,
                userId: props.id,
                questionNum: selectedQuestion.question_num,
                flagText: issue,
            }),
        });

        handleCloseModal();
    };

    const fetchImageUrl = async (examId, userId) => {
        const response = await fetch(`http://localhost/api/users/scans/${examId}/${userId}`);
        const data = await response.json();
        console.log(data.path);
        return data.path;
      };
    
      const displayImage = (path) => {
        const imageContainer = document.getElementById('imageContainer');
        if(imageContainer) {
            imageContainer.innerHTML = '';
            const imgElement = document.createElement('img');
            imgElement.src = 'http://localhost' + path;
            imgElement.alt = 'Scan Image';
            imgElement.className = 'rounded-lg';
            console.log('Displaying image from:' + imgElement.src);
            imageContainer.appendChild(imgElement);
        }
      };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className={`p-4 flex flex-col min-h-screen ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'}`}>
            <h1 className="text-3xl font-bold mb-4">Exam Details</h1>
            <button
                onClick={() => navigate(-1)} // Navigate back to the previous page
                className={`w-full px-4 py-2 rounded transition duration-200 mb-4 ${theme === 'dark' ? 'bg-gray-700 text-white hover:bg-blue-600' : 'bg-gray-300 text-black hover:bg-blue-400'}`}
            >
                Back
            </button>

            {questions.length === 0 ? (
                <div className="text-center text-xl text-red-500">This Exam has not been checked by the instructor</div>
            ) : (
                <div className="flex-grow overflow-x-auto">
                    <div id="imageContainer"></div>
                    <table className="w-full min-w-[800px] text-left border-separate" style={{ borderSpacing: '0 10px' }}>
                        <thead>
                            <tr>
                                <th className={`p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-300 text-black'}`}>Question</th>
                                <th className={`p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-300 text-black'}`}>Number of Options</th>
                                <th className={`p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-300 text-black'}`}>Weight</th>
                                <th className={`p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-300 text-black'}`}>Correct Answers</th>
                                <th className={`p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-300 text-black'}`}>Grade</th>
                                <th className={`p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-300 text-black'}`}>Issues</th>
                            </tr>
                        </thead>
                        <tbody>
                            {questions.map((question, index) => (
                                <tr key={index} className="cursor-pointer">
                                    <td className={`p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-300 text-black'}`}>{question.question_num}</td>
                                    <td className={`p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-300 text-black'}`}>{question.num_options}</td>
                                    <td className={`p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-300 text-black'}`}>{question.weight}</td>
                                    <td className={`p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-300 text-black'}`}>
                                        <Bubble question={question} theme={theme} />
                                    </td>
                                    <td className={`p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-300 text-black'}`}>{question.grade}</td>
                                    <td className={`p-4 ${theme === 'dark' ? 'bg-gray-800 text-white justify-center' : 'bg-gray-300 text-black justify-center'}`}>
                                        {question.issue ? question.issue : <FontAwesomeIcon icon={faFlag} onClick={() => handleFlagClick(question)} />}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            <Modal 
                show={showModal} 
                handleClose={handleCloseModal} 
                handleSubmit={handleSubmit} 
                issue={issue} 
                setIssue={setIssue} 
            />
        </div>
    );
};

export default ExamDetails;
