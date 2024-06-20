import React, { useState } from 'react';

const AddCourseModal = ({ isOpen, onClose, onAddCourse }) => {
  const [courseDept, setCourseDept] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [courseSection, setCourseSection] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddCourse({
      courseDept,
      courseCode,
      courseSection,
      description,
      startDate,
      endDate,
    });
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold mb-4">Add New Course</h2>
        <form onSubmit={handleSubmit}>
        <div className="mb-4">
            <label className="block text-gray-700 mb-2">Course Code</label>
            <select
              id="courseDept"
              name="courseDept"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              value={courseDept}
              onChange={(e) => setCourseDept(e.target.value)}
              required
            >
              <option value="">--Please choose a department--</option>
              <option value="MATH">MATH</option>
              <option value="PHYS">PHYS</option>
              <option value="CHEM">CHEM</option>
              <option value="BIOL">BIOL</option>
              <option value="COMP">COMP</option>
              <option value="ECON">ECON</option>
              <option value="HIST">HIST</option>
              <option value="PSYC">PSYC</option>
              <option value="ENGL">ENGL</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Course Code</label>
            <input
              type="text"
              id="courseCode"
              name="courseCode"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              value={courseCode}
              placeholder="ex. 100"
              onChange={(e) => setCourseCode(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Course Section</label>
            <select
              type="text"
              id="courseSection"
              name="courseSection"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              value={courseSection}
              onChange={(e) => setCourseSection(e.target.value)}
              required
            >
              <option value="">--Please choose a section--</option>
              <option value="001">001</option>
              <option value="002">002</option>
              <option value="003">003</option>
              <option value="004">004</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Course Description</label>
            <input
              type="text"
              id="description"
              name="description"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              value={description}
              placeholder="ex. Introduction to Computer Science"
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Start Date</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">End Date</label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>
          <div className="flex">
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
