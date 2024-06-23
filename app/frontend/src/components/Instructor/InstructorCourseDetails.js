import React, { useEffect, useState, useCallback } from 'react';
import { useParams, NavLink } from 'react-router-dom';
import MenuBar from './MenuBar'; 
import SearchBar from './SearchBar'; 
import StudentList from './StudentList'; 
import getTestData from '../../hooks/getTestData';
import { useTheme } from '../../App';

const InstructorCourseDetails = () => {
  const { courseId } = useParams();
  const [tests, setTests] = useState([]);
  const [courseName, setCourseName] = useState('Loading')
  const [selectedMenu, setSelectedMenu] = useState('tests');
  const { theme } = useTheme();

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
  };

  return (
    <div className={`p-4 flex flex-col min-h-screen ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'}`}>
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold">{courseName} {selectedMenu === 'tests' ? 'Tests' : 'Students'}</h2>
      </div>
      <div className={`mb-4 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-300'}`}>
        <MenuBar selectedMenu={selectedMenu} setSelectedMenu={setSelectedMenu} />
      </div>
      <SearchBar />
      {selectedMenu === 'tests' && (
        <div className="p-4 flex flex-col min-h-screen">
        <div className="flex-grow">
          <h2 className="text-2xl font-bold">{courseName}</h2>
          <div className={`mx-4 font-semibold text-lg ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
            <span className="w-[40%] inline-block">Test</span>
            <span className="w-[20%] inline-block text-center">Mean</span>
            <span className="w-[13%] inline-block text-right">Upload</span>
            <span className="w-[13%] inline-block text-right">Edit</span>
            <span className="w-[13%] inline-block text-right">Delete</span>
          </div>
          <div className="mt-4">
            {tests.map((test, index) => (
              <div key={index} className={`p-4 mb-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'} text-black`}>
                <NavLink to={`../../student/exam/${test.id}`}>
                  <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{test.name}</h3>
                  <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Date Marked: {test.date_marked.slice(0,10)}</p> 
                </NavLink> 
              </div>
            ))}
          </div>
        </div>
      </div>
      )}
      {selectedMenu === 'students' && (
        <StudentList courseId={courseId} />
      )}
    </div>
  );
};

export default InstructorCourseDetails;
