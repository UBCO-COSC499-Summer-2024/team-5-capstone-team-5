import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import getCourseData from '../../hooks/getCourseData'; // Ensure this is the correct path
import InstructorCourseList from './InstructorCourseList'; // Import the InstructorCourseList component

const InstNavbar = () => {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const courseData = await getCourseData('instructor'); // Assume 'instructor' fetches instructor courses
        setCourses(courseData || []);
      } catch (error) {
        setError(error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="h-full w-64 bg-gray-800 text-white flex flex-col justify-between fixed overflow-scroll">
      <div>
        <nav>
          <div className="pb-2 sticky top-0 bg-gray-900 pt-8">
            <img src={`${process.env.PUBLIC_URL}/gradeit.svg`} alt="Logo" className="w-48 mx-auto" />
            <NavLink
              to="/recent"
              className={({ isActive }) => isActive ? "block mt-4 mx-4 py-2 px-4 mb-2 rounded-lg bg-gray-700 text-white font-bold" : "block mt-4 mx-4 py-2 px-4 mb-2 rounded-lg text-gray-300 hover:bg-gray-600 hover:text-white"}
            >
              Recent Courses
            </NavLink>
          </div>
          <div className="mt-4">
            <InstructorCourseList /> {/* Use the InstructorCourseList component */}
          </div>
        </nav>
      </div>
      <div className="flex flex-col p-4 sticky bottom-0 bg-gray-900">
        <NavLink
          to="/about"
          className={({ isActive }) => isActive ? "block py-2 px-4 mb-2 rounded-lg bg-gray-700 text-white font-bold" : "block py-2 px-4 mb-2 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white"}
        >
          About
        </NavLink>
        <NavLink
          to="/contact"
          className={({ isActive }) => isActive ? "block py-2 px-4 mb-2 rounded-lg bg-gray-700 text-white font-bold" : "block py-2 px-4 mb-2 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white"}
        >
          Contact
        </NavLink>
        <div className="mt-auto"></div>
      </div>
    </div>
  );
};

export default InstNavbar;
