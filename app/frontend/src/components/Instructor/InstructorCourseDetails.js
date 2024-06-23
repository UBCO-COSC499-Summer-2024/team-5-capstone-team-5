import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import MenuBar from './MenuBar'; 
import SearchBar from './SearchBar'; 
import StudentList from './StudentList'; 

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
  const [tests, setTests] = useState(mockTests);
  const [courseName, setCourseName] = useState('Loading');
  const [selectedMenu, setSelectedMenu] = useState('tests');

  const fetchData = useCallback(async () => {
    try {
      // Simulating data fetching with mock data
      const testData = mockTests;
      console.log(testData); // Debugging log
      setTests(testData);
      setCourseName(`Course ${courseId}`);
    } catch (error) {
      console.error('Error fetching test data:', error);
    }
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
        <div className="mt-4">
          <table className="w-full text-left border-separate" style={{ borderSpacing: '0 10px' }}>
            <thead>
              <tr className="bg-gray-900">
                <th className="p-4 text-white">Test</th>
                <th className="p-4 text-white">Mean</th>
                <th className="p-4 text-white text-center">Upload</th>
                <th className="p-4 text-white text-center">Edit</th>
                <th className="p-4 text-white text-center">Delete</th>
              </tr>
            </thead>
            <tbody>
              {tests.map((test) => (
                <tr key={test.id} className="bg-gray-700 text-white rounded-lg">
                  <td className="p-4">{test.name}</td>
                  <td className="p-4">{test.mean}</td>
                  <td className="p-4 text-center">
                    <button onClick={() => console.log('Upload clicked for test id:', test.id)} className="bg-blue-500 p-2 rounded">⤴</button>
                  </td>
                  <td className="p-4 text-center">
                    <button onClick={() => console.log('Edit clicked for test id:', test.id)} className="bg-orange-500 p-2 rounded">✎</button>
                  </td>
                  <td className="p-4 text-center">
                    <button onClick={() => console.log('Delete clicked for test id:', test.id)} className="bg-red-500 p-2 rounded">✗</button>
                  </td>
                </tr>
              ))}
              <tr className="bg-gray-700 text-white rounded-lg text-center">
                <td colSpan="5" className="p-4 cursor-pointer" onClick={handleAddClick}>+</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
      {selectedMenu === 'students' && (
        <StudentList />
      )}
    </div>
  );
};

export default InstructorCourseDetails;
