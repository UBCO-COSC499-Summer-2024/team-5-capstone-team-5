import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import getCourseData from '../../hooks/getCourseData';
import AddCourseModal from './AddCourseModal'; // Ensure the path is correct

const InstructorCourseList = ({ userId }) => {
  const [courses, setCourses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getCourseData(userId);
        console.log('Fetched courses:', data);  // Log the fetched courses
        if (data && data.length > 0) {
          setCourses(data);
        } else {
          console.error('No data received');
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, [userId]);

  const handleAddCourse = async (newCourse) => {
    try {
      const response = await fetch('http://localhost:3000/api/courses', {  // Ensure the URL matches your backend
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCourse),
      });
      if (response.ok) {
        const addedCourse = await response.json();
        setCourses([...courses, addedCourse]);
      } else {
        console.error('Error adding course:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error adding course:', error);
    }
  };

  return (
    <div className="h-full w-64 bg-gray-800 text-white flex flex-col fixed overflow-scroll p-4">
      <h2 className="text-lg font-bold mb-4">Courses</h2>
      <ul className="space-y-4">
        {courses.map(course => (
          <li key={course.id} className="bg-gray-700 p-4 rounded-lg shadow-md">
            <Link to={`/instructor/course/${course.id}`} className="block">
              <h3 className="text-xl font-semibold mb-2">{course.name}</h3>
              <p className="text-sm text-gray-300 mb-1">{course.description}</p>
              <p className="text-sm text-gray-400">{course.end_date}</p>
            </Link>
          </li>
        ))}
        <li
          className="bg-gray-700 p-4 rounded-lg shadow-md text-center text-green-500 cursor-pointer"
          onClick={() => setIsModalOpen(true)}
        >
          <div>+</div>
        </li>
      </ul>
      <AddCourseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddCourse={handleAddCourse}
      />
    </div>
  );
};

export default InstructorCourseList;
