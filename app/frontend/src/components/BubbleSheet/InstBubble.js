import React, { useState, useEffect } from 'react';

const InstBubble = ({ question, setQuestion }) => {
  const [selected, setSelected] = useState(question.correct_answer || []);

  const handleSelect = (option) => {
    const newSelection = selected.includes(option)
      ? selected.filter(item => item !== option)
      : [...selected, option];
    setSelected(newSelection);
    setQuestion({ ...question, correct_answer: newSelection });
  };

  useEffect(() => {
    setSelected(question.correct_answer || []);
    console.log(selected);

  }, [question]);

  return (
    <div className="flex flex-wrap mt-2">
      {['A', 'B', 'C', 'D', 'E'].map((option, index) => (
        <div
          key={index}
          className={`w-10 h-10 rounded-full border-2 m-1 flex items-center justify-center cursor-pointer
            ${selected.includes(option) ? 'bg-green-500 text-white border-green-700' : 'bg-gray-700 text-white border-gray-300'}`}
          onClick={() => handleSelect(option)}
        >
          {option}
        </div>
      ))}
    </div>
  );
};

export default InstBubble;
