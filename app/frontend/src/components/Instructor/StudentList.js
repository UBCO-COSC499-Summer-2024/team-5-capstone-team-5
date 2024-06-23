import React, { useEffect, useState } from 'react';
import studentListDetails from './studentListDetails'; // Ensure this path is correct

const StudentList = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    // Simulate fetching data
    setStudents(studentListDetails);
  }, []);

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
              <th className="p-4 bg-gray-800 text-white">Quiz 1</th>
              <th className="p-4 bg-gray-800 text-white">Quiz 2</th>
              {/* Add more quiz columns as needed */}
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr key={index} className="bg-gray-700 text-white rounded-lg">
                <td className="p-4">{student.studentId}</td>
                <td className="p-4">{student.lastName}</td>
                <td className="p-4">{student.firstName}</td>
                <td className="p-4">{student.quiz1}</td>
                <td className="p-4">{student.quiz2}</td>
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
