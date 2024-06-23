import React, { useEffect, useState, useCallback } from 'react';
import studentListDetails from './studentListDetails'; // Ensure this path is correct
import getStudentData from '../../hooks/getStudentData';

const StudentList = (props) => {
  const [students, setStudents] = useState([]);

  const fetchData = useCallback(async () => {
    const data = await getStudentData(props.courseId);
    setStudents(data);
  }
);

  useEffect(() => {
    fetchData();
  }, [props.courseId]);

  return (
    <div className="p-4 flex flex-col min-h-screen">
      <div className="flex-grow">
        <h2 className="text-2xl font-bold mb-4">Students</h2>
        <table className="w-full text-left border-separate" style={{ borderSpacing: '0 10px' }}>
          <thead>
            <tr>
              <th className="p-4 bg-gray-800 text-white">Student ID</th>
              <th className="p-4 bg-gray-800 text-white">Last Name</th>
              <th className="p-4 bg-gray-800 text-white">First Name</th>
              <th className="p-4 bg-gray-800 text-white">Role</th>
              {/* Add more quiz columns as needed */}
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr key={index} className="bg-gray-700 text-white rounded-lg">
                <td className="p-4">{student.id}</td>
                <td className="p-4">{student.last_name}</td>
                <td className="p-4">{student.first_name}</td>
                <td className="p-4">{student.role == 1 ? "Student" : "Instructor"}</td>
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
