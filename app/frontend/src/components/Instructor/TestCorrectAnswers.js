import React, { useState, useEffect } from 'react';
import { useTheme } from '../../App';
import { useLocation, useNavigate } from 'react-router-dom';

const TestCorrectAnswers = () => {
  const { theme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const { test } = location.state || {};
  const { courseId, testId } = useParams();
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [fileUploaded, setFileUploaded] = useState(localStorage.getItem('fileUploaded') || 1);
  const [answerKeyUploaded, setAnswerKeyUploaded] = useState(localStorage.getItem('answerKeyUploaded') || 1);
  const [numQuestions, setNumQuestions] = useState(100);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetch(`http://localhost/api/users/questions/answers/${testId}`);
      const results = await data.json();
      setQuestions(results);
      console.log(questions)
      console.log(results);
      setLoading(false);
    }
    fetchData();
  }, [testId]);

  const handleFileUpload = async (event) => {
    setFileUploaded(2);
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      await fetch('http://localhost/api/users/tests/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'testid': test.id,
          'numquestions': numQuestions
        },
      });
      console.log('File uploaded:', file);
      setFileUploaded(3);
    }
  };

  const handleAnswerKeyUpload = async (event) => {
    setAnswerKeyUploaded(2);
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch('http://localhost/api/users/tests/answers', {
        method: 'POST',
        body: formData,
        headers: {
          'testid': test.id,
          'numquestions': numQuestions,
        },
      });
      const data = await response.json();
      console.log('File uploaded:', file);
      setAnswerKeyUploaded(3);
      test.correctAnswers = data.correctAnswers;
    }
  };

  return (
    <div className={`p-4 flex flex-col min-h-screen ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'}`}>
      <button
        onClick={() => navigate(-1)}
        className={`px-4 py-2 rounded transition duration-200 mb-4 ${theme === 'dark' ? 'bg-gray-700 text-white hover:bg-blue-600' : 'bg-gray-300 text-black hover:bg-blue-400'}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7 7-7M21 12H3" />
        </svg>
        Back
      </button>
      <div className="flex-grow">
        <div className={`rounded-lg p-6 shadow-lg relative mb-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
          <h2 className="text-2xl font-bold mb-4">{test?.name} - Correct Answers</h2>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center">
              <label htmlFor="100q" className="mr-2">100 Questions</label>
              <input type="radio" id="100q" name="numquestions" checked="checked" onClick={() => setNumQuestions(100)} />
              <label htmlFor="200q" className="mr-2 ml-4">200 Questions</label>
              <input type="radio" id="200q" name="numquestions" onClick={() => setNumQuestions(200)} />
            </div>
            <div className="flex items-center">
              <label className="block text-sm font-medium mb-2 mr-4">Upload Answer Key</label>
              <input
                type="file"
                accept="application/pdf"
                onChange={handleAnswerKeyUpload}
                className={`block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:cursor-pointer
                  ${theme === 'dark' ? 'file:bg-gray-700 file:text-white' : 'file:bg-gray-300 file:text-black'}
                `}
              />
              {answerKeyUploaded === 2 && (
                <p className={`mt-2 text-sm font-medium ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-700'}`}>
                  File upload in progress!
                </p>
              )}
            </div>
            <div className="flex items-center">
              <label className="block text-sm font-medium mb-2 mr-4">Upload Student Tests</label>
              {fileUploaded === 3 ? (
                <p className={`mt-2 text-sm font-medium ${theme === 'dark' ? 'text-green-400' : 'text-green-700'}`}>
                  Student tests uploaded successfully!
                </p>
              ) : (
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileUpload}
                  className={`block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:cursor-pointer
                    ${theme === 'dark' ? 'file:bg-gray-700 file:text-white' : 'file:bg-gray-300 file:text-black'}
                  `}
                />
              )}
              {fileUploaded === 2 && (
                <p className={`mt-2 text-sm font-medium ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-700'}`}>
                  File upload in progress!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestCorrectAnswers;
