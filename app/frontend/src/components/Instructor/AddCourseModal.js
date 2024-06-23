import React, { useState } from 'react';

const AddCourseModal = ({ isOpen, onClose, onAddCourse }) => {
  const [courseCode, setCourseCode] = useState('');
  const [courseNumber, setCourseNumber] = useState('');
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddCourse({
      course_code: courseCode,
      course_number: courseNumber,
      name: name,
      start_date: startDate,
      end_date: endDate
    });
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 text-white rounded-lg p-4 w-96">
        <h2 className="text-lg font-bold mb-4">Add New Course</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Course Code</label>
            <input
              type="text"
              className="w-full p-2 rounded-lg bg-gray-700 text-white"
              value={courseCode}
              onChange={(e) => setCourseCode(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Course Number</label>
            <input
              type="text"
              className="w-full p-2 rounded-lg bg-gray-700 text-white"
              value={courseNumber}
              onChange={(e) => setCourseNumber(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Name/Description</label>
            <input
              type="text"
              className="w-full p-2 rounded-lg bg-gray-700 text-white"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Start Date</label>
            <input
              type="date"
              className="w-full p-2 rounded-lg bg-gray-700 text-white"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">End Date</label>
            <input
              type="date"
              className="w-full p-2 rounded-lg bg-gray-700 text-white"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Add Course
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCourseModal;
