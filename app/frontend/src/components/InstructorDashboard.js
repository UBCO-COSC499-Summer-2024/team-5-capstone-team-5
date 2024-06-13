import React from 'react';
import { Link, Route, Routes } from 'react-router-dom';

const InstructorDashboard = () => {
  const quizzes = [
    { id: 1, name: 'Quiz 1', score: '82.0%' },
    { id: 2, name: 'Quiz 2', score: '76.6%' },
    { id: 3, name: 'Midterm', score: '63.1%' },
    { id: 4, name: 'Quiz 3', score: '79.2%' },
    { id: 5, name: 'Quiz 4', score: '-' },
  ];

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
              <Link to="/instructor/dashboard">Dashboard</Link>
            </li>
            <li className="mb-2 p-2 bg-gray-700 rounded">MATH 100-001<br /><span className="text-sm text-gray-400">Differential Calculus<br />Winter 2024</span></li>
            <li className="mb-2 p-2 bg-gray-700 rounded border-l-4 border-red-500">MATH 100-002<br /><span className="text-sm text-gray-400">Differential Calculus<br />Winter 2024</span></li>
            <li className="mb-2 p-2 bg-gray-700 rounded">MATH 100-001L<br /><span className="text-sm text-gray-400">Lab Component<br />Winter 2024</span></li>
            <li className="mb-2 p-2 bg-gray-700 rounded">MATH 319-001<br /><span className="text-sm text-gray-400">Partial Differential Equations<br />Winter 2024</span></li>
            <li className="p-2 bg-gray-700 rounded text-center text-green-500">+</li>
          </ul>
        </aside>
        <main className="flex-1 p-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold">Assessments</h2>
            <nav>
              <button className="bg-gray-700 px-4 py-2 rounded mr-2">Assessments</button>
              <button className="bg-gray-700 px-4 py-2 rounded">Grade Report</button>
            </nav>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="p-2">Assessment</th>
                <th className="p-2">Mean Score</th>
                <th className="p-2">Options</th>
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
        </main>
      </div>
    </div>
  );
};

export default InstructorDashboard;
