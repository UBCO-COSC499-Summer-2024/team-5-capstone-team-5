// app/frontend/src/components/CourseDetails.js
import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import getTestData from '../hooks/getTestData';
import { useTheme } from '../App'; // Assuming useTheme is available at this path

const CourseDetails = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [tests, setTests] = useState([]);
  const [courseName, setCourseName] = useState('Loading');
  const { theme } = useTheme();

  const fetchData = useCallback(async () => {
    const testData = await getTestData(courseId);
    console.log(testData);
    setTests(testData);
    console.log(testData)
    setCourseName(testData[0].department + " " + testData[0].code + "-" + String(testData[0].section).padStart(3, '0'));
  }, [courseId]);

  useEffect(() => {
    fetchData();
  }, [courseId, fetchData]);

  const handleRowClick = (examId) => {
    navigate(`/student/exam/${examId}`);
  };

  return (
    <div className={`p-4 flex flex-col min-h-screen ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'}`}>
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold">{courseName} Tests</h2>
      </div>
      <div className="flex-grow">
        <table className="w-full text-left border-separate" style={{ borderSpacing: '0 10px' }}>
          <thead>
            <tr>
              <th className={`p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-300 text-black'}`}>Test</th>
              <th className={`p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-300 text-black'}`}>Mean</th>
            </tr>
          </thead>
          <tbody>
            {tests.map((test, index) => (
              test.visibility &&
              <tr key={index} className="cursor-pointer" onClick={() => handleRowClick(test.id)}>
                <td className={`p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-300 text-black'}`}>{test.name}</td>
                <td className={`p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-300 text-black'}`}>{test.mean}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CourseDetails;
