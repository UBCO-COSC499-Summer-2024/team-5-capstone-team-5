import React from 'react';
import { useParams } from 'react-router-dom';

const CourseDetails = () => {
  const { courseId } = useParams();
  
  // Dummy data for demonstration
  const dummyData = {
    "1": {
      title: 'MATH 100-003 Tests',
      averageGrade: '72.83%',
      tests: [
        { title: 'Final Exam', grade: '86.2%', stats: 'Median: 82% Mean: 81.4% Max: 100% Min: 54.3%' },
        { title: 'Midterm 2', grade: '77.2%', stats: 'Median: 71% Mean: 70.3% Max: 94.2% Min: 45%' },
        { title: 'Mid-Midterm 2', grade: '86.2%', stats: 'Median: 82% Mean: 81.4% Max: 100% Min: 54.3%' },
        { title: 'Midterm 1', grade: '86.2%', stats: 'Median: 82% Mean: 81.4% Max: 100% Min: 54.3%' },
        { title: 'Evaluation Quiz', grade: '15%', stats: 'Median: 100% Mean: 98.3% Max: 100% Min: 15%' },
      ],
    },
    // Add more dummy data for other courses as needed
  };

  const courseData = dummyData[courseId] || dummyData["1"];

  return (
    <div className="p-4 flex flex-col min-h-screen">
      <div className="flex-grow">
        <h2 className="text-2xl font-bold">{courseData.title}</h2>
        <p className="text-lg mt-2">Your Average Grade: {courseData.averageGrade}</p>
        <div className="mt-4">
          {courseData.tests.map((test, index) => (
            <div key={index} className="p-4 mb-4 rounded-lg bg-gray-700 text-white">
              <h3 className="text-xl font-bold">{test.title}</h3>
              <p className="text-lg">{test.grade}</p>
              <p className="text-sm text-gray-400">{test.stats}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
