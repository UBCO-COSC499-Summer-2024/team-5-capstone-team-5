import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MenuBar from './MenuBar'; 
import SearchBar from './SearchBar'; 
import StudentList from './StudentList'; 
import getTestData from '../../hooks/getTestData';
import TestDescription from './TestDescription'; // Import TestDescription
import { useTheme } from '../../App';

const InstructorCourseDetails = () => {
  const { courseId } = useParams();
  const [tests, setTests] = useState([]);
  const [courseName, setCourseName] = useState('Loading');
  const [selectedMenu, setSelectedMenu] = useState('tests');
  const [selectedTest, setSelectedTest] = useState(null); // Add state for selected test
  const { theme } = useTheme();
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    const testData = await getTestData(courseId);
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
            {selectedTest ? (
              <TestDescription
                test={selectedTest}
                onBack={() => setSelectedTest(null)}
                navigateToDetails={() => navigate(`/exam/${selectedTest.id}`)}
              />
            ) : (
              <table className="w-full text-left border-separate" style={{ borderSpacing: '0 10px' }}>
                <thead>
                  <tr>
                    <th className={`p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-300 text-black'}`}>Test</th>
                    <th className={`p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-300 text-black'}`}>Mean</th>
                  </tr>
                </thead>
                <tbody>
                  {tests.map((test, index) => (
                    <tr
                      key={index}
                      className={`cursor-pointer ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-300 text-black'}`}
                      onClick={() => setSelectedTest(test)}
                    >
                      <td className="p-4">{test.name}</td>
                      <td className="p-4">{test.mean_score || 'N/A'}</td>
                    </tr>
                  ))}
                  <tr
                    className="cursor-pointer items-center justify-center"
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
                    <td colSpan="2" className="p-4">
                      <div className="text-2xl">+</div>
                      <div className="absolute bottom-full mb-2 w-max bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 tooltip">
                        Add Test
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            )}
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
