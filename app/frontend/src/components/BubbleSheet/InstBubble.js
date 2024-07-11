// app/frontend/src/components/BubbleSheet/InstBubble.js
import React from 'react';

const InstBubble = ({ question, onSelect, readOnly }) => {
  const options = ['A', 'B', 'C', 'D', 'E'];

  return (
    <div className="flex space-x-2">
      {options.map(option => (
        <div
          key={option}
          role="button"
          className={`w-8 h-8 flex items-center justify-center rounded-full border cursor-pointer ${question.correct_answer && question.correct_answer.includes(options.indexOf(option)) ? 'bg-green-500 text-white' : 'bg-gray-300 text-black'}`}
          onClick={!readOnly ? () => {
            console.log(`Selected option: ${option}`);
            onSelect(option);
          } : null}
        >
          {option}
        </div>
      ))}
    </div>
  );
};

export default InstBubble;
