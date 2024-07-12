// InstBubble.js
import React from 'react';

const InstBubble = ({ question, isEditing, onBubbleClick }) => {
  const options = ['A', 'B', 'C', 'D', 'E'];
  const correctAnswers = question.correctAnswer || [];

  const handleBubbleClick = (option) => {
    if (isEditing) {
      onBubbleClick(question.question_num, option);
    }
  };

  return (
    <div className="flex space-x-2">
      {options.map((option) => (
        <div
          key={option}
          className={`w-8 h-8 flex items-center justify-center rounded-full border cursor-pointer ${
            correctAnswers.includes(option) ? 'bg-green-500 text-white' : 'bg-gray-300 text-black'
          } ${isEditing ? 'hover:bg-blue-300' : ''}`}
          onClick={() => handleBubbleClick(option)}
        >
          {option}
        </div>
      ))}
    </div>
  );
};

export default InstBubble;
