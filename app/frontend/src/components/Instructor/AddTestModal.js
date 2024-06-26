import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import InstBubble from '../BubbleSheet/InstBubble';

const AddTestModal = ({ isOpen, onClose, onSave }) => {
  const [questions, setQuestions] = useState([]);
  const [examName, setExamName] = useState(''); 

  const addQuestion = () => {
    setQuestions([...questions, { correct_answer: [] }]);
  };

  const deleteQuestion = (index) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
  };

  const handleSave = () => {
    onSave({ name: examName, questions });
    onClose();
  };

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${isOpen ? '' : 'hidden'}`}>
      <div className="bg-gray-800 p-4 rounded-lg w-96">
        <h2 className="text-2xl font-bold mb-4">Add New Test</h2>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">Exam Name</label>
          <input
            type="text"
            value={examName}
            onChange={(e) => setExamName(e.target.value)}
            className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter exam name"
          />
        </div>
        <p className="mb-2">Number of Questions Added: {questions.length}</p>
        <button
          onClick={addQuestion}
          className="bg-blue-500 text-white px-4 py-2 rounded mb-4 hover:bg-blue-600"
        >
          Add Question
        </button>
        {questions.map((question, index) => (
          <div key={index} className="mb-4">
            <div className="flex justify-between items-center">
              <p className="text-lg font-bold">Question {index + 1}</p>
              <FontAwesomeIcon 
                icon={faTrash} 
                className="text-gray-400 hover:text-red-500 cursor-pointer"
                title="Delete Question"
                onClick={() => deleteQuestion(index)}
              />
            </div>
            <InstBubble
              question={question}
              setQuestion={(updatedQuestion) => {
                const updatedQuestions = [...questions];
                updatedQuestions[index] = updatedQuestion;
                setQuestions(updatedQuestions);
              }}
            />
          </div>
        ))}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded mr-2 hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Save Test
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTestModal;
