import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams, Route, Routes } from 'react-router-dom';
import getTestData from '../../hooks/getTestData'; // Ensure this path is correct
import StudentList from './StudentList';

const InstructorCourseDetails = () => {
  const { courseId } = useParams();
  const [tests, setTests] = useState([]);
  const [courseName, setCourseName] = useState('Loading');
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    try {
      const testData = await getTestData(courseId);
      console.log(testData); // Debugging log
      setTests(testData);
      setCourseName(testData[0]?.course_name || 'Course');
    } catch (error) {
      console.error('Error fetching test data:', error);
    }
  }, [courseId]);

  useEffect(() => {
    fetchData();
  }, [courseId, fetchData]);

  const handleStudentsClick = () => {
    navigate(`/instructor/course/${courseId}/students`);
  };

  const handleUploadClick = (testId) => {
    console.log('Upload clicked for test id:', testId);
    // Add your upload logic here
  };

  const handleEditClick = (testId) => {
    console.log('Edit clicked for test id:', testId);
    // Add your edit logic here
  };

  const handleDeleteClick = (testId) => {
    console.log('Delete clicked for test id:', testId);
    // Add your delete logic here
  };

  return (
    <div className="p-4 flex flex-col min-h-screen">
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold">{courseName} Tests</h2>
        <div>
          <button
            onClick={() => navigate(`/instructor/course/${courseId}/tests`)}
            className="bg-gray-700 px-4 py-2 rounded mr-2"
          >
            Tests
          </button>
          <button
            onClick={handleStudentsClick}
            className="bg-gray-700 px-4 py-2 rounded"
          >
            Students
          </button>
        </div>
      </div>
      <div>
        <table className="w-full text-left">
          <thead>
            <tr>
              <th className="p-2">Test</th>
              <th className="p-2">Mean</th>
              <th className="p-2">Upload / Edit / Delete</th>
            </tr>
          </thead>
          <tbody>
            {tests.map((test) => (
              <tr key={test.id} className="bg-gray-800 mb-2 p-2 rounded">
                <td className="p-2">{test.name}</td>
                <td className="p-2">{test.mean}</td>
                <td className="p-2 flex justify-around">
                  <button onClick={() => handleUploadClick(test.id)} className="bg-blue-500 p-2 rounded">⤴</button>
                  <button onClick={() => handleEditClick(test.id)} className="bg-orange-500 p-2 rounded">✎</button>
                  <button onClick={() => handleDeleteClick(test.id)} className="bg-red-500 p-2 rounded">✗</button>
                </td>
              </tr>
            ))}
            <tr className="bg-gray-800 mb-2 p-2 rounded text-center">
              <td colSpan="3" className="p-2 text-green-500 cursor-pointer">+</td>
            </tr>
          </tbody>
        </table>
      </div>
      <Routes>
        <Route path="/students" element={<StudentList />} />
      </Routes>
    </div>
  );
};

export default InstructorCourseDetails;
