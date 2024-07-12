import React from 'react';

const InstBubble = ({ question }) => {
  const options = ['A', 'B', 'C', 'D', 'E'];
  const correctAnswers = question.correctAnswer || [];

  return (
    <div className="flex space-x-2">
      {options.map(option => (
        <div
          key={option}
          className={`w-8 h-8 flex items-center justify-center rounded-full border ${
            correctAnswers.includes(option) ? 'bg-green-500 text-white' : 'bg-gray-300 text-black'
          }`}
        >
          {option}
        </div>
      ))}
    </div>
  );
};

export default InstBubble;
