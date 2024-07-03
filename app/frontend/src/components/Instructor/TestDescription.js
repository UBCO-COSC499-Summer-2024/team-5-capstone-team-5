import React, { useState } from 'react';
import { useTheme } from '../../App';
import TestCorrectAnswers from './TestCorrectAnswers'; // Import the new component

const TestDescription = ({ test, onBack, courseId }) => {
  const { theme } = useTheme();
  const [fileUploaded, setFileUploaded] = useState(false);
  const [showCorrectAnswers, setShowCorrectAnswers] = useState(false);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file)
      const response = await fetch('http://localhost/api/users/tests/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'courseid': courseId
        }
      });
      console.log('File uploaded:', file);
      setFileUploaded(true);
    }
  };

  const handleViewCorrectAnswers = () => {
    setShowCorrectAnswers(true);
  };

  const handleBackToDescription = () => {
    setShowCorrectAnswers(false);
  };

  if (!test) return null;

  return (
    <div className={`p-4 flex flex-col min-h-screen ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'}`}>
      {!showCorrectAnswers ? (
        <>
          <button
            onClick={onBack}
            className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200 mb-4 ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-300 hover:bg-gray-200'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7 7-7M21 12H3" />
            </svg>
            Back
          </button>
          <div className={`rounded-lg p-6 shadow-lg  ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
            <h2 className="text-2xl font-bold mb-4">{test.name}</h2>
            {test.date_marked && <p className="mb-2"><strong>Date Marked:</strong> {test.date_marked.slice(0, 10)}</p>}
            {test.mean_score && <p className="mb-4"><strong>Mean Score:</strong> {test.mean_score}</p>}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Upload PDF File</label>
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
              {fileUploaded && (
                <p className={`mt-2 text-sm font-medium ${theme === 'dark' ? 'text-green-400' : 'text-green-700'}`}>
                  File uploaded successfully!
                </p>
              )}
            </div>
            <button
              onClick={handleViewCorrectAnswers}
              className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200 ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-300 hover:bg-gray-200'}`}
            >
              Correct Answers
            </button>
          </div>
        </>
      ) : (
        <TestCorrectAnswers test={test} onBack={handleBackToDescription} />
      )}
    </div>
  );
};

export default TestDescription;
