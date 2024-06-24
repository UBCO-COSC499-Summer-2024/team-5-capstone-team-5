import React, { useEffect, useState, useCallback } from 'react';
import { useParams, NavLink, useNavigate } from 'react-router-dom';
import MenuBar from './MenuBar'; 
import SearchBar from './SearchBar'; 
import StudentList from './StudentList'; 
import getTestData from '../../hooks/getTestData';
import { useTheme } from '../../App';

const InstructorCourseDetails = () => {
  const { courseId } = useParams();
  const [tests, setTests] = useState([]);
  const [courseName, setCourseName] = useState('Loading');
  const [selectedMenu, setSelectedMenu] = useState('tests');
  const { theme } = useTheme();
  const navigate = useNavigate();

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
            <div className="mx-4 font-semibold text-lg">
              <span className="w-[70%] inline-block">Test</span>
              <span className="w-[30%] inline-block text-center">Mean</span>
            </div>
            <div className="mt-4">
              {tests.map((test, index) => (
                <div
                  key={index}
                  className={`p-4 mb-4 rounded-lg cursor-pointer ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'} text-black`}
                  onClick={() => navigate(`../../student/exam/${test.id}`)}
                >
                  <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{test.name}</h3>
                  <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Date Marked: {test.date_marked.slice(0,10)}</p> 
                </div>
              ))}
              <div
                className="relative p-4 mb-4 rounded-lg cursor-pointer flex items-center justify-center"
                onClick={handleAddClick}
                style={{
                  height: '4.5rem',
                  backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                  color: theme === 'dark' ? 'white' : 'black',
                  border: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(0, 0, 0, 0.2)',
                  width: '100%',
                  textAlign: 'center',
                }}
              >
                <div className="text-2xl">+</div>
                <div className="absolute bottom-full mb-2 w-max bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 tooltip">
                  Add Test
                </div>
              </div>
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
