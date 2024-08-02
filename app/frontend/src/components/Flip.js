// app/frontend/src/components/Flip.js

import React, { useState } from 'react';
import ReactCardFlip from 'react-card-flip';
import { useTheme } from '../App';
import classNames from 'classnames';

<<<<<<< HEAD
const Flip = ({ course, flipped, onFlip, onSave }) => {
  const [department, setDepartment] = useState(course.department);
  const [code, setCode] = useState(course.code);
  const [section, setSection] = useState(course.section);
=======
const Flip = ({ course, flipped, onFlip, onSave, isSelected }) => {
  const [name, setName] = useState(course.name);
>>>>>>> origin/Styling
  const [description, setDescription] = useState(course.description);
  const [startDate, setStartDate] = useState(course.start_date);
  const [endDate, setEndDate] = useState(course.end_date);
  const { theme } = useTheme();

  const handleDeptChange = (e) => setDepartment(e.target.value);
  const handleCodeChange = (e) => setCode(e.target.value);
  const handleSectionChange = (e) => setSection(e.target.value);
  const handleDescriptionChange = (e) => setDescription(e.target.value);
  const handleStartDateChange = (e) => setStartDate(e.target.value);
  const handleEndDateChange = (e) => setEndDate(e.target.value);

  const updateCourse = async () => {
    try {
      const response = await fetch('http://localhost/api/courses/edit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          course_id: course.course_id,
          department,
          code,
          section,
          description,
          start_date: startDate,
          end_date: endDate,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update course');
      }
  
      const data = await response.json();
      console.log('Course updated successfully:', data);
      return data;
    } catch (error) {
      console.error('Error updating course:', error);
    }
  };

  const handleSave = () => {
    onSave(course.course_id, { department, code, section, description, start_date: startDate, end_date: endDate });
    updateCourse();
    onFlip(course.course_id);
  };

<<<<<<< HEAD
  const frontCardStyle = theme === 'dark' ? 'text-white' : 'text-black';
  const backCardStyle = theme === 'dark' ? 'text-white' : 'text-black';
  const inputStyle = theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-black';
  const buttonStyle = theme === 'dark' ? 'bg-blue-600 text-white hover:bg-blue-500' : 'bg-blue-400 text-black hover:bg-blue-300';

  return (
    <ReactCardFlip isFlipped={flipped} flipDirection="horizontal">
      <div className={`front p-4 rounded-lg shadow-lg ${frontCardStyle}`}>
        <h3 className="font-bold text-lg">{`${course.department} ${course.code}-${String(course.section).padStart(3, "0")}`}</h3>
=======
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
>>>>>>> origin/Styling
        <p className="mt-2">{course.description}</p>
        <p className="mt-2 text-gray-400">Ends: {course.end_date.slice(0, 10)}</p>
      </div>

<<<<<<< HEAD
      <div className={`back p-4 rounded-lg shadow-lg ${backCardStyle}`} style={{ minHeight: '100px' }}>
        <div className="mb-2">
          <label className="font-bold text-lg" htmlFor="department">Edit Department</label>
          <input
            name="department"
            type="text"
            value={department}
            onChange={handleDeptChange}
            className={`block w-full mt-2 p-2 rounded border ${inputStyle}`}
          />
        </div>
        <div className="mb-2">
          <label className="font-bold text-lg" htmlFor="code">Edit Code</label>
          <input
            name="code"
            type="text"
            value={code}
            onChange={handleCodeChange}
            className={`block w-full mt-2 p-2 rounded border ${inputStyle}`}
          />
        </div>
        <div className="mb-2">
          <label className="font-bold text-lg" htmlFor="section">Edit Section</label>
          <input
            name="section"
            type="text"
            value={section}
            onChange={handleSectionChange}
            className={`block w-full mt-2 p-2 rounded border ${inputStyle}`}
          />
        </div>
        <div className="mb-2">
          <label className="font-bold text-lg" htmlFor="description">Edit Description</label>
          <textarea
            name="description"
            value={description}
            onChange={handleDescriptionChange}
            className={`block w-full mt-2 p-2 rounded border ${inputStyle}`}
          />
        </div>
        <div className="mb-2">
          <label className="font-bold text-lg" htmlFor="endDate">Edit Start Date</label>
          <input
            name="endDate"
            type="date"
            value={startDate.slice(0, 10)}
            onChange={handleStartDateChange}
            className={`block w-full mt-2 p-2 rounded border ${inputStyle}`}
          />
        </div>
        <div className="mb-4">
          <label className="font-bold text-lg" htmlFor="endDate">Edit End Date</label>
          <input
            name="endDate"
            type="date"
            value={endDate.slice(0, 10)}
            onChange={handleEndDateChange}
            className={`block w-full mt-2 p-2 rounded border ${inputStyle}`}
          />
        </div>
=======
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
>>>>>>> origin/Styling
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