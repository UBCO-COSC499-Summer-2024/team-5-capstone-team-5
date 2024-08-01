// app/frontend/src/components/Flip.js

import React, { useState } from 'react';
import ReactCardFlip from 'react-card-flip';
import { useTheme } from '../App';
import classNames from 'classnames';

const Flip = ({ course, flipped, onFlip, onSave, isSelected }) => {
  const [name, setName] = useState(course.name);
  const [description, setDescription] = useState(course.description);
  const [endDate, setEndDate] = useState(course.end_date);
  const { theme } = useTheme();

  const handleNameChange = (e) => setName(e.target.value);
  const handleDescriptionChange = (e) => setDescription(e.target.value);
  const handleEndDateChange = (e) => setEndDate(e.target.value);

  const handleSave = () => {
    onSave(course.course_id, { name, description, end_date: endDate });
    onFlip(course.course_id);
  };

  const cardClass = classNames('transition-all duration-300 p-4 border-none', {
    'bg-gray-900 text-white hover:bg-gray-700': theme === 'dark' && !isSelected,
    'bg-gray-700': theme === 'dark' && isSelected,
    'bg-gray-200 text-black hover:bg-gray-400': theme === 'light' && !isSelected,
    'bg-gray-300': theme === 'light' && isSelected,
  });

  return (
    <ReactCardFlip isFlipped={flipped} flipDirection="horizontal">
      <div className={`front ${cardClass}`} style={{ minHeight: '150px', borderRadius: '0' }}>
        <h3 className="font-bold text-lg">{course.department + " " + course.code + "-" + String(course.section).padStart(3, "0")}</h3>
        <p className="mt-2">{course.description}</p>
        <p className="mt-2 text-gray-400">Ends: {course.end_date.slice(0, 10)}</p>
      </div>

      <div className={`back ${cardClass}`} style={{ minHeight: '150px', borderRadius: '0' }}>
        <h3 className="font-bold text-lg">Edit Course Details</h3>
        <input
          type="text"
          value={name}
          onChange={handleNameChange}
          className={`block w-full mt-2 p-2 rounded border ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'}`}
        />
        <textarea
          value={description}
          onChange={handleDescriptionChange}
          className={`block w-full mt-2 p-2 rounded border ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'}`}
          rows="4"
        />
        <input
          type="date"
          value={endDate.slice(0, 10)}
          onChange={handleEndDateChange}
          className={`block w-full mt-2 p-2 rounded border ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'}`}
        />
        <button
          onClick={handleSave}
          className={`mt-4 px-4 py-2 rounded ${theme === 'dark' ? 'bg-gray-600 text-white hover:bg-gray-500' : 'bg-gray-300 text-black hover:bg-gray-400'}`}
        >
          Save
        </button>
      </div>
    </ReactCardFlip>
  );
};

export default Flip;
