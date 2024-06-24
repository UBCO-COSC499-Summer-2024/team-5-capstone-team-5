import React from 'react';
import { useTheme } from '../../App';

const TestDescription = ({ test, onBack }) => {
  const { theme } = useTheme();

  if (!test) return null;

  return (
    <div className={`p-4 flex flex-col min-h-screen ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'}`}>
      <button
        onClick={onBack}
        className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200 mb-4 ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-300 hover:bg-gray-200'}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7 7-7M21 12H3" />
        </svg>
        Back
      </button>
      <div className={`rounded-lg p-6 shadow-lg relative ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
        <h2 className="text-2xl font-bold mb-4">{test.name}</h2>
        <p className="mb-2"><strong>Date Marked:</strong> {test.date_marked.slice(0, 10)}</p>
        <p className="mb-4"><strong>Mean Score:</strong> {test.mean_score}</p>
      </div>
    </div>
  );
};

export default TestDescription;
