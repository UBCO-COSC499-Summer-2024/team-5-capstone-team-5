import React, { useEffect, useState, useCallback } from 'react';
import getStudentData from '../../hooks/getStudentData';
import { useTheme } from '../../App'; // Adjust the path as needed

const StudentList = (props) => {
  const [students, setStudents] = useState([]);
  const { theme } = useTheme();

  const fetchData = useCallback(async () => {
    const data = await getStudentData(props.courseId);
    setStudents(data);
  }, [props.courseId]);

  useEffect(() => {
    fetchData();
  }, [props.courseId, fetchData]);

  return (
    <div className="p-4 flex flex-col min-h-screen">
      <div className="flex-grow">
        <h2 className="text-2xl font-bold mb-4">Students</h2>
        <table className="w-full text-left border-separate" style={{ borderSpacing: '0 10px' }}>
          <thead>
            <tr>
              <th className={`p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-300 text-black'}`}>Student ID</th>
              <th className={`p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-300 text-black'}`}>Last Name</th>
              <th className={`p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-300 text-black'}`}>First Name</th>
              <th className={`p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-300 text-black'}`}>Role</th>
              {/* Add more quiz columns as needed */}
            </tr>
          </thead>
          <tbody>
          {students.filter(student => student.role === 1).map((student, index) => (
            <tr key={index} className={`rounded-lg ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'}`}>
              <td className="p-4">{student.id}</td>
              <td className="p-4">{student.last_name}</td>
              <td className="p-4">{student.first_name}</td>
              <td className="p-4">{student.role === 1 ? "Student" : "Instructor"}</td>
              {/* Add more quiz columns as needed */}
            </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentList;
