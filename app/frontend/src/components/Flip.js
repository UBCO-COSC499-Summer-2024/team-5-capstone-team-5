// app/frontend/src/components/Flip.js
import React, { useState } from 'react';
import ReactCardFlip from 'react-card-flip';

const Flip = ({ course, handleFlipClick, flipped }) => {
  const [name, setName] = useState(course.name);
  const [description, setDescription] = useState(course.description);

  const handleNameChange = (e) => setName(e.target.value);
  const handleDescriptionChange = (e) => setDescription(e.target.value);

  return (
    <ReactCardFlip isFlipped={flipped} flipDirection="horizontal">
      <div className="front p-4 rounded-lg bg-gray-800 text-white" onClick={handleFlipClick}>
        <h3 className="font-bold text-lg">{course.name}</h3>
        <p className="mt-2">{course.description}</p>
        <p className="mt-2 text-gray-400">Ends: {course.end_date.slice(0, 10)}</p>
      </div>

      <div className="back p-4 rounded-lg bg-gray-700 text-white" onClick={handleFlipClick}>
        <h3 className="font-bold text-lg">Edit Course Details</h3>
        <input
          type="text"
          value={name}
          onChange={handleNameChange}
          className="block w-full mt-2 p-2 rounded border bg-gray-800 text-white"
        />
        <textarea
          value={description}
          onChange={handleDescriptionChange}
          className="block w-full mt-2 p-2 rounded border bg-gray-800 text-white"
          rows="4"
        />
      </div>
    </ReactCardFlip>
  );
};

export default Flip;
