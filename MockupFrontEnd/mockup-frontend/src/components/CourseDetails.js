import React from 'react';
import { Link } from 'react-router-dom';

const courses = [
  { id: 1, name: "Math 101", term: "Default Term" },
  { id: 2, name: "Math 102", term: "2022W1" },
  { id: 3, name: "Math 201", term: "2023W2" },
  { id: 4, name: "Math 202", term: "2023W2" },
  { id: 5, name: "Math 301", term: "2024S1-2" },
  { id: 6, name: "Math 302", term: "2021W2" },
  { id: 7, name: "Math 401", term: "2023W2" },
  { id: 8, name: "Math 402", term: "Default Term" },
];

const CourseDetails = () => {
  return (
    <div className="course-details p-4 bg-white h-screen">
      <h1 className="text-2xl font-bold text-blue-900">Courses</h1>
      <ul className="mt-4 space-y-2">
        {courses.map(course => (
          <li key={course.id}>
            <Link to="#" className="text-blue-600 hover:underline">
              {course.name}
            </Link>
            <span className="block text-gray-500 text-sm">{course.term}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CourseDetails;
