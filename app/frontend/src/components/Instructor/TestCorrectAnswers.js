import React, { useState, useEffect } from 'react';
import { useTheme } from '../../App';
import InstBubble from '../BubbleSheet/InstBubble';

const TestCorrectAnswers = ({ test, onBack, onEditTest }) => {
  const { theme } = useTheme();
  const [questions, setQuestions] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(test.name || '');
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(`http://localhost/api/users/questions/answers/${test.id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = await response.json();
        console.log('Fetched questions:', data); // Log fetched data
        if (Array.isArray(data)) {
          // Filter out duplicates based on question_num
          const uniqueQuestions = data.filter((item, index, self) =>
            index === self.findIndex((q) => q.question_num === item.question_num)
          );
          setQuestions(uniqueQuestions);
        } else {
          setQuestions([]);
        }
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    fetchQuestions();
  }, [test.id]);

  const handleEditTestName = async () => {
    await onEditTest(test.id, newName);
    setIsEditing(false);
    // Update the test name in the component state
    test.name = newName;
  };

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
      <div className="flex-grow">
        <div className={`rounded-lg p-6 shadow-lg relative mb-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
          <h2 className="text-2xl font-bold mb-4">{test.name} - Correct Answers</h2>
          <p className="mb-4">Total Questions: {questions.length}</p> {/* Display the total number of questions */}
          {isEditing ? (
            <div className="mb-4">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className={`p-2 border rounded ${theme === 'dark' ? 'bg-gray-700 text-white border-gray-500' : 'bg-gray-200 text-black border-gray-300'}`}
              />
              <button
                onClick={handleEditTestName}
                className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200 ml-2 ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-300 hover:bg-gray-200'}`}
              >
                Save
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className={`px-4 py-2 rounded transition duration-200 ml-2 mb-4 ${theme === 'dark' ? 'bg-gray-700 text-white hover:bg-yellow-500' : 'bg-gray-300 text-black hover:bg-yellow-400'}`}
            >
              Edit Test
            </button>
          )}
          <table className="w-full text-left border-separate" style={{ borderSpacing: '0 10px' }}>
            <thead>
              <tr>
                <th className="p-4">Question</th>
                <th className="p-4">Correct Answer(s)</th>
              </tr>
            </thead>
            <tbody>
              {questions.length > 0 ? (
                questions.map((q, index) => (
                  <tr key={`question-${index}`} className={((index % 2 === 1) ? "" : "bg-white/10") + " rounded-lg"}>
                    <td className="p-4">Question {q.question_num}</td>
                    <td className="p-4">
                      <InstBubble question={q} readOnly={true} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2" className="p-4 text-center">No questions found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TestCorrectAnswers;
