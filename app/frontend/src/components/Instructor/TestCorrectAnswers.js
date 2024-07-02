import React from 'react';
import { useTheme } from '../../App';

const mockTestResults = {
  questions: [
    {
      question: "Question 1",
      correctAnswer: ["A", "C"],
      mostChosenAnswers: ["A", "B"]
    },
    {
      question: "Question 2",
      correctAnswer: ["B"],
      mostChosenAnswers: ["B", "C"]
    },
    {
      question: "Question 3",
      correctAnswer: ["C", "D"],
      mostChosenAnswers: ["C", "D"]
    },
  ]
};

const TestCorrectAnswers = ({ test, onBack }) => {
  const { theme } = useTheme();
  const results = mockTestResults; // Replace this with real data as needed

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
      <div className="flex-grow">
        <div className={`rounded-lg p-6 shadow-lg relative mb-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
          <h2 className="text-2xl font-bold mb-4">{test.name} - Correct Answers</h2>
          <table className="w-full text-left border-separate" style={{ borderSpacing: '0 10px' }}>
            <thead>
              <tr>
                <th className={`p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-300 text-black'}`}>Question</th>
                <th className={`p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-300 text-black'}`}>Correct Answer(s)</th>
                <th className={`p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-300 text-black'}`}>Most Chosen Answer(s)</th>
              </tr>
            </thead>
            <tbody>
              {results.questions.map((q, index) => (
                <tr key={index} className={`rounded-lg ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'}`}>
                  <td className="p-4">{q.question}</td>
                  <td className="p-4">
                    <div className="flex space-x-2">
                      {q.correctAnswer.map(answer => (
                        <div
                          key={answer}
                          className="w-8 h-8 flex items-center justify-center rounded-full border bg-green-500 text-white"
                        >
                          {answer}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex space-x-2">
                      {q.mostChosenAnswers.map(answer => (
                        <div
                          key={answer}
                          className="w-8 h-8 flex items-center justify-center rounded-full border bg-blue-500 text-white"
                        >
                          {answer}
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TestCorrectAnswers;
