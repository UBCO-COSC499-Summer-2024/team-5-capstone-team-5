import React, { useEffect, useState, useCallback } from 'react';
import getStudentData from '../../hooks/getStudentData';
import { useTheme } from '../../App';
import StudentSpreadsheet from './StudentSpreadsheet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import FontAwesomeIcon
import { faEnvelope } from '@fortawesome/free-regular-svg-icons'; // Import specific icon

const StudentList = (props) => {
  const [students, setStudents] = useState([]);
  const { theme } = useTheme();
  const [fileUploaded, setFileUploaded] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true); // Set loading to true before starting the fetch
    const data = await getStudentData(props.courseId);
    setStudents(data);
    setLoading(false); // Set loading to false after the data is fetched
  }, [props.courseId]);

  const handleRosterUpload = async (event) => {
    try {
      setFileUploaded(2);
      const file = event.target.files[0];
  
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
  
        const response = await fetch('http://localhost/api/users/upload', {
          method: 'POST',
          body: formData,
          headers: {
            'courseid': props.courseId
          }
        });
  
        if (response.ok) {
          console.log('File uploaded successfully:', file.name);
          setFileUploaded(3);
          await new Promise(resolve => setTimeout(resolve, 1000));
          await fetchData(); // Ensure fetchData is awaited
        } else {
          console.error('File upload failed:', response.statusText);
          setFileUploaded(4);
          const errorText = await response.text();
          console.error('Error response:', errorText);
        }
      } else {
        console.warn('No file selected for upload');
      }
    } catch (error) {
      console.error('An error occurred during file upload:', error);
      setFileUploaded(4);
    }
  };

  useEffect(() => {
    fetchData();
  }, [props.courseId, fetchData]);

  const instructor = students.find(student => student.role === 2);
  const studentList = students.filter(student => student.role === 1);

  if (loading) {
    return <div>Loading...</div>
  } else {
    return (
      <div className="p-4 flex flex-col min-h-screen">
        <div className="flex-grow">
          {instructor && (
            <div className={`p-4 mb-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-300 text-black'}`}>
              <h3 className="text-xl font-semibold">Instructor: {instructor.first_name} {instructor.last_name}</h3>
            </div>
          )}
          <button
            className={`mb-4 p-2 rounded ${theme === 'dark' ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-gray-300 text-black hover:bg-gray-400'} flex items-center`}
            onClick={() => {/* Handle invite action here */}}
          >
            <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
            Invite
          </button>

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
        </div>
        <StudentSpreadsheet courseId = {props.courseId} students = {studentList} courseName = {props.courseName} asPercents = {props.asPercents}/>
      </div>
    );
  }
};

export default StudentList;
