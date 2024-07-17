// app/frontend/src/components/Instructor/TestCorrectAnswers.js

import React, { useState, useEffect } from 'react';
import { useTheme } from '../../App';
import InstBubble from '../BubbleSheet/InstBubble';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFlag, faTrash } from '@fortawesome/free-solid-svg-icons';
import PDFViewer from './PDFViewer';
import { useLocation, useNavigate } from 'react-router-dom';

const TestCorrectAnswers = () => {
  const { theme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const { test } = location.state || {};
  const [questions, setQuestions] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(test?.name || '');
  const [showPdf, setShowPdf] = useState(false);
  const [documentUrl, setDocumentUrl] = useState(null);
  const [fileUploaded, setFileUploaded] = useState(localStorage.getItem('fileUploaded') || 1);
  const [answerKeyUploaded, setAnswerKeyUploaded] = useState(localStorage.getItem('answerKeyUploaded') || 1);
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
        console.log('Fetched questions:', data);
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

    if (answerKeyUploaded === 3) {
      fetchQuestions();
    }
  }, [test?.id, answerKeyUploaded]);

  useEffect(() => {
    console.log('Questions data being displayed:', questions);
  }, [questions]);

  useEffect(() => {
    localStorage.setItem('fileUploaded', fileUploaded);
  }, [fileUploaded]);

  useEffect(() => {
    localStorage.setItem('answerKeyUploaded', answerKeyUploaded);
  }, [answerKeyUploaded]);

  const handleEditTestName = async () => {
    try {
      const response = await fetch(`http://localhost/api/users/tests/${test.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newName }),
      });
      if (response.ok) {
        test.name = newName;
        setIsEditing(false);
      } else {
        alert('Failed to update test name.');
      }
    } catch (error) {
      console.error('Error updating test name:', error);
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost/api/users/questions/answers/${test.id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
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
      const answerKeyUrl = URL.createObjectURL(file); // Create URL for the uploaded file
      setAnswerKeyUploaded(3);
      setDocumentUrl(answerKeyUrl); // Set the document URL for the PDF viewer
      setQuestions(data.correctAnswers || []);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const blob = new Blob([reader.result], { type: file.type });
        const url = URL.createObjectURL(blob);
        setDocumentUrl(url);
        console.log("Document URL set:", url);
        setShowPdf(true);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleFileRemove = () => {
    setFileUploaded(1);
    setDocumentUrl(null);
    localStorage.removeItem('uploadedFileUrl');
  };

  const handleAnswerKeyRemove = () => {
    setAnswerKeyUploaded(1);
    setQuestions([]);
    setDocumentUrl(null); // Clear the document URL when answer key is removed
    localStorage.removeItem('answerKeyUploaded');
  };

  const handleViewPdf = () => {
    console.log("View PDF clicked, documentUrl:", documentUrl);
    setShowPdf(true);
  };

  return (
    <div className={`p-4 flex flex-col min-h-screen ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'}`}>
      {showPdf ? (
        <PDFViewer documentUrl={documentUrl} />
      ) : (
        <>
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
                onClick={handleViewPdf}
                className={`mb-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200 ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-300 hover:bg-gray-200'}`}
              >
                View PDF
              </button>
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
                  className={`px-4 py-2 rounded transition duration-200 mb-4 ${theme === 'dark' ? 'bg-gray-700 text-white hover:bg-yellow-500' : 'bg-gray-300 text-black hover:bg-yellow-400'}`}
                >
                  Edit Test
                </button>
              )}
              <p className="mb-4">Total Questions: {questions.length}</p>
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
        </>
      )}
    </div>
  );
};

export default TestCorrectAnswers;
