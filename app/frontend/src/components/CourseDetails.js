// src/components/CourseDetails.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getTestData } from '../hooks/getTestData';

const CourseDetails = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestData = async () => {
      try {
        const data = await getTestData(courseId);
        setCourse(data);
      } catch (error) {
        console.error('Error fetching test data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTestData();
  }, [courseId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!course) {
    return <div>No Data Available</div>;
  }

  return (
    <div>
      <h2>{course.name}</h2>
      {course.tests.length > 0 ? (
        course.tests.map((test, index) => <p key={index}>{test}</p>)
      ) : (
        <p>No Data Available</p>
      )}
    </div>
  );
};

export default CourseDetails;
