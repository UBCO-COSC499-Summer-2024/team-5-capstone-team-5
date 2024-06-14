import React, { useState } from 'react';

const mockCourses = [
  {
    id: 1,
    name: 'MATH 100-001',
    description: 'Differential Calculus',
    term: 'Winter 2024',
    quizzes: [
      { id: 1, name: 'Quiz 1', score: '86.2%' },
      { id: 2, name: 'Quiz 2', score: '86.2%' },
      { id: 3, name: 'Midterm 1', score: '86.2%' },
      { id: 4, name: 'Quiz 3', score: '86.2%' },
      { id: 5, name: 'Quiz 4', score: '86.2%' }
    ]
  },
  {
    id: 2,
    name: 'MATH 100-002',
    description: 'Differential Calculus',
    term: 'Winter 2024',
    quizzes: []
  },
  {
    id: 3,
    name: 'MATH 200-001',
    description: 'Proof Techniques',
    term: 'Winter 2024',
    quizzes: []
  }
];

const InstructorDashboard = () => {
  const [courses] = useState(mockCourses);
  const [selectedCourse, setSelectedCourse] = useState(mockCourses[0]);
  const [quizzes, setQuizzes] = useState(mockCourses[0].quizzes);

  const handleCourseClick = (course) => {
    setSelectedCourse(course);
    setQuizzes(course.quizzes);
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen p-4">
      <header className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <img src="/logo.svg" alt="Logo" className="h-8 mr-2" />
          <h1 className="text-2xl font-bold">GradeIT OMR Technologies</h1>
        </div>
        <div>
          <p className="text-sm">John Doe</p>
          <p className="text-sm">Instructor ID: 123456789</p>
        </div>
        <button className="bg-gray-700 px-4 py-2 rounded">Logout</button>
      </header>
      <div className="flex">
        <aside className="w-1/4 bg-gray-800 p-4 rounded">
          <h2 className="text-lg font-bold mb-4">Courses</h2>
          <ul>
            <li className="mb-2 p-2 bg-gray-700 rounded">
              <div>Dashboard</div>
            </li>
            {courses.map(course => (
              <li
                key={course.id}
                className={`mb-2 p-2 bg-gray-700 rounded ${selectedCourse.id === course.id ? 'border-l-4 border-blue-500' : ''}`}
                onClick={() => handleCourseClick(course)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    {course.name}<br />
                    <span className="text-sm text-gray-400">{course.description}<br />{course.term}</span>
                  </div>
                  <div className="flex space-x-2">
                    <button className="bg-blue-500 p-2 rounded">⤴</button>
                    <button className="bg-orange-500 p-2 rounded">✎</button>
                    <button className="bg-red-500 p-2 rounded">✗</button>
                  </div>
                </div>
              </li>
            ))}
            <li className="p-2 bg-gray-700 rounded text-center text-green-500">+</li>
          </ul>
        </aside>
        <main className="flex-1 p-4">
          {selectedCourse && (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold">{selectedCourse.name} Tests</h2>
              </div>
              <table className="w-full text-left">
                <thead>
                  <tr>
                    <th className="p-2">Test</th>
                    <th className="p-2">Mean</th>
                    <th className="p-2">Upload / Edit / Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {quizzes.map((quiz) => (
                    <tr key={quiz.id} className="bg-gray-800 mb-2 p-2 rounded">
                      <td className="p-2">{quiz.name}</td>
                      <td className="p-2">{quiz.score}</td>
                      <td className="p-2 flex justify-around">
                        <button className="bg-blue-500 p-2 rounded">⤴</button>
                        <button className="bg-orange-500 p-2 rounded">✎</button>
                        <button className="bg-red-500 p-2 rounded">✗</button>
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-gray-800 mb-2 p-2 rounded text-center">
                    <td colSpan="3" className="p-2 text-green-500">+</td>
                  </tr>
                </tbody>
              </table>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default InstructorDashboard;
