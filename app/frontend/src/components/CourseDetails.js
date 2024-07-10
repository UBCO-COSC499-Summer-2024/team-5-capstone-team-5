// app/frontend/src/components/CourseDetails.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import  getTestData from '../hooks/getTestData';

const CourseDetails = () => {
  const { courseId } = useParams();
  const [loading, setLoading] = useState(true);
  const [tests, setTests] = useState([]);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const data = await getTestData(courseId);
        setTests(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching tests:', error);
        setLoading(false);
      }
    };

    fetchTests();
  }, [courseId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {tests.length > 0 ? (
        tests.map((test) => (
          <div key={test.id} className="test-item">
            {test.name}
          </div>
        ))
      ) : (
        <div>No tests available</div>
      )}
    </div>
  );
};

export default CourseDetails;
