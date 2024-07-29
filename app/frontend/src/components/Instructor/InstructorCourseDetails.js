import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MenuBar from './MenuBar'; 
import SearchBar from './SearchBar'; 
import StudentList from './StudentList'; 
import getTestData from '../../hooks/getTestData';
import TestDescription from './TestDescription'; 
import { useTheme } from '../../App';
import InstructorTest from '../Modules/InstructorTestModule';
import AddTestModal from './AddTestModal';
import getCourseInfo from '../../hooks/getCourseInfo';
import getGrades from '../../hooks/getGrades';
import ParseStudentGrades from './ParseStudentGrades';

const InstructorCourseDetails = () => {
  const { courseId } = useParams();
  const [tests, setTests] = useState([]);
  const [courseName, setCourseName] = useState('Loading');
  const [selectedMenu, setSelectedMenu] = useState('tests');
  const [selectedTest, setSelectedTest] = useState(null);
  const [gradeList, setGradeList] = useState(null);
  const [isAddTestModalOpen, setIsAddTestModalOpen] = useState(false); 
  const { theme } = useTheme();
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    const testData = await getTestData(courseId);
    const courseData = await getCourseInfo(courseId);
    setGradeList(await getGrades(courseId));
    setTests(testData);
    setCourseName(courseData.name);
  }, [courseId, isAddTestModalOpen]);

  const parsedGrades = gradeList ? ParseStudentGrades(gradeList) : null;

  useEffect(() => {
    fetchData();
  }, [courseId, fetchData, selectedMenu]);

  const handleAddClick = () => {
    setIsAddTestModalOpen(true);
  };

  const handleAddTest = (newTest) => {
    setTests([...tests, newTest]);
  };

  const handleDeleteTest = async (testId) => {
    try {
      await fetch(`http://localhost/api/users/tests/delete/${testId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Include token if needed
        },
      });
      setTests(tests.filter(test => test.id !== testId));
      setSelectedTest(null); // Ensure the deleted test is no longer selected
    } catch (error) {
      console.error('Error deleting test:', error);
    }
  };

  const handleEditTest = async (testId, newName) => {
    try {
      const response = await fetch(`http://localhost/api/users/tests/edit/${testId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Include token if needed
        },
        body: JSON.stringify({ name: newName }),
      });

      if (response.ok) {
        const updatedTests = tests.map(test => (test.id === testId ? { ...test, name: newName } : test));
        setTests(updatedTests);

        // Update the selected test with the new name
        if (selectedTest && selectedTest.id === testId) {
          setSelectedTest({ ...selectedTest, name: newName });
        }
      } else {
        console.error('Error editing test:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error editing test:', error);
    }
  };

  return (
    <div className={`p-4 flex flex-col min-h-screen ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'}`}>
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold">{courseName} {selectedMenu === 'tests' ? 'Tests' : 'Students'}</h2>
      </div>
      <div className={`mb-4 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-300'}`}>
        <MenuBar selectedMenu={selectedMenu} setSelectedMenu={setSelectedMenu} />
      </div>
      {/* <SearchBar /> */}
      {selectedMenu === 'tests' && (
        <div className="p-4 flex flex-col min-h-screen">
          <div className="flex-grow">
            {selectedTest ? (
              <TestDescription
                test={selectedTest}
                onBack={() => setSelectedTest(null)}
                onDeleteTest={handleDeleteTest}
                onEditTest={handleEditTest}
              />
            ) : (
              <table className="w-full text-left border-separate" style={{ borderSpacing: '0 10px' }}>
                <thead>
                  <tr>
                    <th className={`p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-300 text-black'}`}>Test</th>
                    <th className={`p-4 text-center ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-300 text-black'}`}>Mean</th>
                    <th className={`p-4 text-center ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-300 text-black'}`}>Stdev</th>
                    <th className={`p-4 text-center ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-300 text-black'}`}>Min</th>
                    <th className={`p-4 text-center ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-300 text-black'}`}>Q1</th>
                    <th className={`p-4 text-center ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-300 text-black'}`}>Median</th>
                    <th className={`p-4 text-center ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-300 text-black'}`}>Q3</th>
                    <th className={`p-4 text-center ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-300 text-black'}`}>Max</th>
                  </tr>
                </thead>
                <tbody>
                  {tests.map((test, index) => (
                    <InstructorTest test={test} key={index} state={selectedTest} setState={setSelectedTest} parsedGrades = {parsedGrades} />
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
                    <td colSpan="8" className="p-4">
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
      {selectedMenu === 'students' && (<>
        <StudentList courseId={courseId} courseName = {courseName}/>
        </>
      )}
      <AddTestModal
        isOpen={isAddTestModalOpen}
        onClose={() => setIsAddTestModalOpen(false)}
        onAddTest={handleAddTest}
        courseId={courseId}
      />
    </div>
  );
};

export default InstructorCourseDetails;
