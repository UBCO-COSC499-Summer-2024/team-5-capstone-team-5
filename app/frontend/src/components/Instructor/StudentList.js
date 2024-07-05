import React, { useEffect, useState, useCallback } from 'react';
import getStudentData from '../../hooks/getStudentData';
import { useTheme } from '../../App';

const StudentList = (props) => {
  const [students, setStudents] = useState([]);
  const { theme } = useTheme();
  const [fileUploaded, setFileUploaded] = useState(1);

  const fetchData = useCallback(async () => {
    const data = await getStudentData(props.courseId);
    setStudents(data);
  }, [props.courseId]);

const handleRosterUpload = async (event) => {
  setFileUploaded(2)
  const file = event.target.files[0];
  if (file) {
    const formData = new FormData();
    formData.append('file', file)
    const response = await fetch('http://localhost/api/users/students/upload', {
      method: 'POST',
      body: formData,
      headers: {
        'courseid': props.courseId
      }
    });
    if(response.ok) {
      console.log('File uploaded:', file);
      setFileUploaded(3);
      fetchData();
    }
  }
};

  useEffect(() => {
    fetchData();
  }, [props.courseId, fetchData]);

  const instructors = students.filter(student => student.role === 2);
  const studentList = students.filter(student => student.role === 1);

  return (
    <div className="p-4 flex flex-col min-h-screen">
      <div className="flex-grow">
        {instructors.length > 0 && (
          <div className={`p-4 mb-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-300 text-black'}`}>
            <h3 className="text-xl font-semibold">Instructor(s):</h3>
            {instructors.map((instructor, index) => (
              <p key={index}>{instructor.first_name} {instructor.last_name}</p>
            ))}
          </div>
        )}

        <label className="block text-sm font-medium mb-2">
          Upload Student Data
        </label>
        <input
          type="file"
          id="studentFile"
          name="studentFile"
          onChange={handleRosterUpload}
          className={`block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:cursor-pointer
            ${theme === 'dark' ? 'file:bg-gray-700 file:text-white' : 'file:bg-gray-300 file:text-black'}
          `}
        />
        <p className={`mb-4 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
          Please upload a CSV file containing student data. The file should have columns for Student ID, Last Name, First Name, and Role.
        </p>
        {fileUploaded == 2 && <p className={theme === 'dark' ? "text-yellow-700" : 'text-yellow-400'}>Uploading File</p>}
        {fileUploaded == 3 && <p className={theme === 'dark' ? "text-green-700" : 'text-green-400'}>File Uploaded!</p>}

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
                <td className="p-4">{String(student.id).padStart(8, "0")}</td>
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
