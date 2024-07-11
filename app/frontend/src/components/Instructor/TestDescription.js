import React, { useState } from 'react';
import { useTheme } from '../../App';
import TestCorrectAnswers from './TestCorrectAnswers';
import Toast from '../Toast';

const TestDescription = ({ test, onBack, onDeleteTest }) => {
  const { theme } = useTheme();
  const [fileUploaded, setFileUploaded] = useState(1); // 1 = nothing, 2 = loading, 3 = uploaded
  const [answerKeyUploaded, setAnswerKeyUploaded] = useState(1);
  const [showCorrectAnswers, setShowCorrectAnswers] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '', showConfirm: false });

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
        },
      });
      const data = await response.json();
      console.log('File uploaded:', file);
      setAnswerKeyUploaded(3);
      // Assuming the correct answers are returned in the response
      test.correctAnswers = data.correctAnswers;
    }
  };

  const handleFileRemove = () => {
    setFileUploaded(1);
  };

  const handleAnswerKeyRemove = () => {
    setAnswerKeyUploaded(1);
    test.correctAnswers = [];
  };

  const handleViewCorrectAnswers = () => {
    if (answerKeyUploaded !== 3) {
      setToast({ show: true, message: 'Please upload the answer key before viewing correct answers.', type: 'error', showConfirm: false });
      return;
    }
    setShowCorrectAnswers(true);
  };

  const handleBackToDescription = () => {
    setShowCorrectAnswers(false);
  };

  const handleDeleteTest = () => {
    setToast({
      show: true,
      message: 'Are you sure you want to delete this test?',
      type: 'error',
      showConfirm: true,
      onConfirm: confirmDelete,
    });
  };

  const confirmDelete = () => {
    onDeleteTest(test.id);
    setToast({ show: false, message: '', type: '', showConfirm: false });
  };

  const handleCloseToast = () => {
    setToast({ show: false, message: '', type: '', showConfirm: false });
  };

  if (!test) return null;

  return (
    <div className={`p-4 flex flex-col min-h-screen ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'}`}>
      {toast.show && <Toast message={toast.message} type={toast.type} onClose={handleCloseToast} onConfirm={toast.onConfirm} showConfirm={toast.showConfirm} />}
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
          <div className={`rounded-lg p-6 shadow-lg ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
            <h2 className="text-2xl font-bold mb-4">{test.name}</h2>
            {test.date_marked && <p className="mb-2"><strong>Date Marked:</strong> {test.date_marked.slice(0, 10)}</p>}
            {test.mean_score && <p className="mb-4"><strong>Mean Score:</strong> {test.mean_score}</p>}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Upload Answer Key</label>
              {answerKeyUploaded === 3 ? (
                <div className="flex items-center">
                  <p className={`mt-2 text-sm font-medium ${theme === 'dark' ? 'text-green-400' : 'text-green-700'}`}>
                    Answer key uploaded successfully!
                  </p>
                  <button
                    onClick={handleAnswerKeyRemove}
                    className={`ml-4 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition duration-200 ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-300 hover:bg-gray-200'}`}
                  >
                    Remove
                  </button>
                </div>
              ) : (
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
              )}
              {answerKeyUploaded === 2 && (
                <p className={`mt-2 text-sm font-medium ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-700'}`}>
                  File upload in progress!
                </p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Upload Student Tests</label>
              {fileUploaded === 3 ? (
                <div className="flex items-center">
                  <p className={`mt-2 text-sm font-medium ${theme === 'dark' ? 'text-green-400' : 'text-green-700'}`}>
                    Student tests uploaded successfully!
                  </p>
                  <button
                    onClick={handleFileRemove}
                    className={`ml-4 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition duration-200 ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-300 hover:bg-gray-200'}`}
                  >
                    Remove
                  </button>
                </div>
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
            <button
              onClick={handleViewCorrectAnswers}
              className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200 ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-300 hover:bg-gray-200'}`}
            >
              Correct Answers
            </button>
            <button
              onClick={handleDeleteTest}
              className={`px-4 py-2 rounded transition duration-200 ml-2 ${theme === 'dark' ? 'bg-gray-700 text-white hover:bg-red-500' : 'bg-gray-300 text-black hover:bg-red-400'}`}
            >
              Delete Test
            </button>
          </div>
        </>
      ) : (
        <TestCorrectAnswers 
          test={test} 
          onBack={handleBackToDescription} 
        />
      )}
    </div>
  );
};

export default TestDescription;
