// TestCorrectAnswers.js
import React, { useState, useEffect } from 'react';
import { useTheme } from '../../App';
import InstBubble from '../BubbleSheet/InstBubble';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFlag, faTrash } from '@fortawesome/free-solid-svg-icons';

const TestCorrectAnswers = ({ test, onBack, onEditTest, answerKeyUploaded, reloadCorrectAnswers }) => {
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
        console.log('Fetched questions:', data); // Log fetched data from API
        if (Array.isArray(data)) {
          const uniqueQuestions = data.filter((item, index, self) =>
            index === self.findIndex((q) => q.question_num === item.question_num)
          );
          const questionsWithAnswers = uniqueQuestions.map(q => ({
            ...q,
            correctAnswer: q.correct_answer ? q.correct_answer.map(pos => letters[pos]) : [],
            hasError: !q.correct_answer || !Array.isArray(q.correct_answer) || q.correct_answer.some(pos => pos < 0 || pos >= letters.length),
          }));
          setQuestions(questionsWithAnswers);
        } else {
          setQuestions([]);
        }
      } catch (error) {
        console.error('Error fetching questions:', error);
        setQuestions([]);
      }
    };

    if (answerKeyUploaded === 3 && reloadCorrectAnswers) {
      fetchQuestions();
    }
  }, [test.id, answerKeyUploaded, reloadCorrectAnswers]);

  useEffect(() => {
    // Log the data being shown on the frontend
    console.log('Questions data being displayed:', questions);
  }, [questions]);

  const handleEditTestName = async () => {
    await onEditTest(test.id, newName);
    setIsEditing(false);
    test.name = newName;
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost/api/users/tests/edit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
          'testid': test.id,
        },
        body: JSON.stringify(questions.map(q => ({
          ...q,
          correct_answer: q.correctAnswer.map(a => letters.indexOf(a)),
        }))),
      });
      if (response.ok) {
        alert('Test updated successfully!');
      } else {
        alert('Failed to update test.');
      }
    } catch (error) {
      console.error('Error saving test:', error);
    }
    setIsEditing(false);
  };

  const handleBubbleClick = (questionNum, option) => {
    console.log("Question Num:",questionNum)
    console.log("Option:",option)
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) => {
        if (q.question_num === questionNum) {
          const correctAnswer = q.correctAnswer || [];
          const index = correctAnswer.indexOf(option);
          if (index > -1) {
            correctAnswer.splice(index, 1);
          } else {
            correctAnswer.push(option);
          }
          return { ...q, correctAnswer: [...correctAnswer] };
        }
        return q;
      })
    );
  };

  const handleDeleteQuestion = (questionNum) => {
    setQuestions((prevQuestions) => prevQuestions.filter((q) => q.question_num !== questionNum));
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
          <p className="mb-4">Total Questions: {questions.length}</p>
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
          {isEditing && (
            <div className="mb-4 flex justify-end">
              <button
                onClick={handleSave}
                className={`px-4 py-2 rounded transition duration-200 ${theme === 'dark' ? 'bg-gray-700 text-white hover:bg-green-600' : 'bg-gray-300 text-black hover:bg-green-400'}`}
              >
                Save All
              </button>
            </div>
          )}
          <table className="w-full text-left border-separate" style={{ borderSpacing: '0 10px' }}>
            <thead>
              <tr>
                <th className="p-4">Question</th>
                <th className="p-4">Correct Answer(s)</th>
                {isEditing && <th className="p-4">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {questions.length > 0 ? (
                questions.map((q, index) => (
                  <tr key={`question-${index}`} className={((index % 2 === 1) ? "" : "bg-white/10") + " rounded-lg"}>
                    <td className="p-4">
                      {q.hasError && <FontAwesomeIcon icon={faFlag} className="text-red-500 mr-2" />}
                      Question {q.question_num}
                    </td>
                    <td className="p-4">
                      <InstBubble question={q} isEditing={isEditing} onBubbleClick={handleBubbleClick} />
                    </td>
                    {isEditing && (
                      <td className="p-4">
                        <button onClick={() => handleDeleteQuestion(q.question_num)} className="text-red-500 hover:text-red-700">
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={isEditing ? 3 : 2} className="p-4 text-center">No questions found</td>
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
