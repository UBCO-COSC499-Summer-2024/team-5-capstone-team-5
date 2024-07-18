// app/frontend/src/components/Instructor/TestDescription.js

import React, { useState } from 'react';
import { useTheme } from '../../App';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import GenerateSheetModal from './GenerateSheetModal';

const TestDescription = ({ test, onBack, onDeleteTest }) => {
  const { courseId } = useParams();
  const [viewAnswers, setViewAnswers] = useState(false);
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleDeleteTest = () => {
    if (window.confirm("Are you sure you want to delete this test?")) {
      onDeleteTest(test.id);
    }
  };

  const handleViewCorrectAnswers = () => {
    navigate(`/instructor/course/${courseId}/test/${test.id}/correct-answers`, { state: { test } });
  };

  const handleGenerateSheet = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  if (!test) return null;

  return (
    <div className={`p-4 flex flex-col min-h-screen ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'}`}>
      <button
        onClick={onBack}
        className={`px-4 py-2 rounded transition duration-200 mb-4 ${theme === 'dark' ? 'bg-gray-700 text-white hover:bg-blue-600' : 'bg-gray-300 text-black hover:bg-blue-400'}`}
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
        <button
          onClick={handleViewCorrectAnswers}
          className={`px-4 py-2 rounded transition duration-200 ${theme === 'dark' ? 'bg-gray-700 text-white hover:bg-blue-600' : 'bg-gray-300 text-black hover:bg-blue-400'}`}
        >
          Standard UBC Sheet
        </button>
        <button
          onClick={handleGenerateSheet}
          className={`px-4 py-2 rounded transition duration-200 ml-4 ${theme === 'dark' ? 'bg-gray-700 text-white hover:bg-green-600' : 'bg-gray-300 text-black hover:bg-green-400'}`}
        >
          Generate a Sheet
        </button>
        <button
          onClick={handleDeleteTest}
          className={`px-4 py-2 rounded transition duration-200 ml-4 ${theme === 'dark' ? 'bg-gray-700 text-white hover:bg-red-600' : 'bg-gray-300 text-black hover:bg-red-400'}`}
        >
          Delete Test
        </button>
      </div>
      <GenerateSheetModal showModal={showModal} onClose={handleCloseModal} />
    </div>
  );
};

export default TestDescription;
