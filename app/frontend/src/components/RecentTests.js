import React from 'react';

const RecentTests = () => {
  const recentTests = [
    { title: 'Final Exam', class: 'MATH 100-003', grade: '86.2%', stats: 'Median: 82% Mean: 81.4% Max: 100% Min: 54.3%' },
    { title: 'Final Exam', class: 'PHYS 101-001', grade: '77.2%', stats: 'Median: 71% Mean: 70.3% Max: 94.2% Min: 45%' },
    { title: 'Final Exam', class: 'CHEM 110-002', grade: '86.2%', stats: 'Median: 82% Mean: 81.4% Max: 100% Min: 54.3%' },
    { title: 'Final Exam', class: 'STAT 230-001', grade: '86.2%', stats: 'Median: 82% Mean: 81.4% Max: 100% Min: 54.3%' },
    { title: 'Final Exam', class: 'ENGL 153-002', grade: '86.2%', stats: 'Median: 82% Mean: 81.4% Max: 100% Min: 54.3%' },
    { title: 'Midterm 2', class: 'PHYS 101-001', grade: '86.2%', stats: 'Median: 82% Mean: 81.4% Max: 100% Min: 54.3%' },
  ];

  return (
    <div className="p-4 flex flex-col min-h-screen">
      <div className="flex-grow">
        <h2 className="text-2xl font-bold">Recent Tests</h2>
        <div className="mt-4">
          {recentTests.map((test, index) => (
            <div key={index} className="p-4 mb-4 rounded-lg bg-gray-700 text-white">
              <h3 className="text-xl font-bold">{test.title}</h3>
              <p className="text-lg">{test.class}</p>
              <p className="text-lg">{test.grade}</p>
              <p className="text-sm text-gray-400">{test.stats}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentTests;
