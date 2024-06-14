import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import getTestData from '../../hooks/getTestData'; // Ensure this path is correct

const InstructorCourseDetails = () => {
  const { courseId } = useParams();
  const [tests, setTests] = useState([]);
  const [courseName, setCourseName] = useState('Loading');

  const fetchData = useCallback(async () => {
    const testData = await getTestData(courseId);
    console.log(testData);
    setTests(testData);
    setCourseName(testData[0].course_name);
  }, [courseId]);

  useEffect(() => {
    fetchData();
  }, [courseId, fetchData]);

  return (
    <div className="p-4 flex flex-col min-h-screen">
      <div className="flex-grow">
        <h2 className="text-2xl font-bold mb-4">{courseName} Tests</h2>
        <table className="w-full text-left">
          <thead>
            <tr>
              <th className="p-2">Test</th>
              <th className="p-2">Mean</th>
              <th className="p-2">Upload / Edit / Delete</th>
            </tr>
          </thead>
          <tbody>
            {tests.map((test, index) => (
              <tr key={index} className="bg-gray-800 mb-2 p-2 rounded">
                <td className="p-2">{test.name}</td>
                <td className="p-2">{test.mean}</td>
                <td className="p-2 flex justify-around">
                  <button className="bg-blue-500 p-2 rounded">⤴</button>
                  <button className="bg-orange-500 p-2 rounded">✎</button>
                  <button className="bg-red-500 p-2 rounded">✗</button>
                </td>
              </tr>
            ))}
            <tr className="bg-gray-800 mb-2 p-2 rounded text-center">
              <td colSpan="3" className="p-2 text-green-500">+</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InstructorCourseDetails;
