import React, { useEffect, useState, useCallback } from 'react';
import { useParams, NavLink } from 'react-router-dom';
import MenuBar from './MenuBar'; 
import SearchBar from './SearchBar'; 
import StudentList from './StudentList'; 
import getTestData from '../../hooks/getTestData';

// Mock data for tests
const mockTests = [
  { id: 1, name: 'Quiz 1', mean: '86.2%' },
  { id: 2, name: 'Quiz 2', mean: '86.2%' },
  { id: 3, name: 'Midterm 1', mean: '86.2%' },
  { id: 4, name: 'Quiz 3', mean: '86.2%' },
  { id: 5, name: 'Quiz 4', mean: '86.2%' },
  { id: 6, name: 'Final Exam', mean: '-' },
];

const InstructorCourseDetails = () => {
  const { courseId } = useParams();
  const [tests, setTests] = useState([]);
  const [courseName, setCourseName] = useState('Loading')
  const [selectedMenu, setSelectedMenu] = useState('tests');

  const fetchData = useCallback(async () => {
    const testData = await getTestData(courseId);
    console.log(testData);
    setTests(testData);
    setCourseName(testData[0].course_name);
  }, [courseId]);

  useEffect(() => {
    fetchData();
  }, [courseId, fetchData]);

  const handleAddClick = () => {
    console.log('Add new test');
    // Add your logic for adding a new test here
  };

  return (
    <div className="p-4 flex flex-col min-h-screen">
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold">{courseName} {selectedMenu === 'tests' ? 'Tests' : 'Students'}</h2>
      </div>
      <div className="bg-gray-800 mb-4">
        <MenuBar selectedMenu={selectedMenu} setSelectedMenu={setSelectedMenu} />
      </div>
      <SearchBar />
      {selectedMenu === 'tests' && (
        <div className="p-4 flex flex-col min-h-screen">
        <div className="flex-grow">
          <h2 className="text-2xl font-bold">{courseName}</h2>
          <div className="mx-4 font-semibold text-lg">
            <span className="w-[40%] inline-block">Test</span>
            <span className="w-[20%] inline-block text-center">Mean</span>
            <span className="w-[13%] inline-block text-right">Upload</span>
            <span className="w-[13%] inline-block text-right">Edit</span>
            <span className="w-[13%] inline-block text-right">Delete</span>
          </div>
          <div className="mt-4">
            {tests.map((test, index) => (
              <div key={index} className="p-4 mb-4 rounded-lg bg-gray-700 text-white">
                <NavLink to={`../../student/exam/${test.id}`}>
                  <h3 className="text-xl font-bold">{test.name}</h3>
                  <p className="text-lg">Date Marked: {test.date_marked.slice(0,10)}</p> 
                </NavLink> 
              </div>
            ))}
          </div>
        </div>
      </div>
      )}
      {selectedMenu === 'students' && (
        <StudentList />
      )}
    </div>
  );
};

export default InstructorCourseDetails;
