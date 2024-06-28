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

  // Filter the instructor from the students
  const instructor = students.find(student => student.role === 2);
  const studentList = students.filter(student => student.role === 1);

  return (
    <div className="p-4 flex flex-col min-h-screen">
      <div className="flex-grow">

        {instructor && (
          <div className={`p-4 mb-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-300 text-black'}`}>
            <h3 className="text-xl font-semibold">Instructor: {instructor.first_name} {instructor.last_name}</h3>
          </div>
        )}

        <input 
          type="file" 
          id="studentFile" 
          name="studentFile" 
          className={`mb-4 ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-300 text-black'}`}
        />
        <p className={`mb-4 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Please upload a CSV file containing student data. The file should have columns for Student ID, Last Name, First Name, and Role.</p>

        <table className="w-full text-left border-separate" style={{ borderSpacing: '0 10px' }}>
          <thead>
            <tr>
              <th className={`p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-300 text-black'}`}>Student ID</th>
              <th className={`p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-300 text-black'}`}>Last Name</th>
              <th className={`p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-300 text-black'}`}>First Name</th>
              <th className={`p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-300 text-black'}`}>Role</th>
            </tr>
          </thead>
          <tbody>
            {studentList.map((student, index) => (
              <tr key={index} className={`rounded-lg ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'}`}>
                <td className="p-4">{student.id}</td>
                <td className="p-4">{student.last_name}</td>
                <td className="p-4">{student.first_name}</td>
                <td className="p-4">{student.role === 1 ? "Student" : "Instructor"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentList;
