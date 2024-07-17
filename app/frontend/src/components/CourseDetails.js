import React, { useEffect, useState, useCallback } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import getTestData from '../hooks/getTestData';
import Course from './Modules/CourseModule';

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
            <Course test={test} key={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
