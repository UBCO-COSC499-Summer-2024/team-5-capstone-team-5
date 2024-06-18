import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import getTestData from '../hooks/getTestData';

const CourseDetails = () => {
  const { courseId } = useParams();
  const [tests, setTests] = useState([]);
  const [courseName, setCourseName] = useState('Loading')

  const fetchData = useCallback(async () => {
    const testData = await getTestData(courseId);
    console.log(testData);
    setTests(testData);
    setCourseName(testData[0].course_name);
  }, [courseId]);

  useEffect( () => {
    fetchData();
  }, [courseId, fetchData]);

  return (
    <div className="p-4 flex flex-col min-h-screen">
      <div className="flex-grow">
        <h2 className="text-2xl font-bold">{courseName}</h2>
        <div className="mt-4">
          {tests.map((test, index) => (
            <div key={index} className="p-4 mb-4 rounded-lg bg-gray-700 text-white">
              <h3 className="text-xl font-bold">{test.name}</h3>
              <p className="text-lg">Date Marked: {test.date_marked.slice(0,10)}</p>  
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
