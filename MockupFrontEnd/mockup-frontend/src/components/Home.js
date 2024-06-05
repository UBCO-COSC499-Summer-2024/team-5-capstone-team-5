import React from 'react';
import { useUser } from '../contexts/UserContext';

const Home = () => {
  const { setRole } = useUser();

  return (
    <div className="home p-8 bg-white shadow rounded">
      <h1 className="text-4xl font-bold text-blue-900">Welcome to GradeIT OMR Technologies</h1>
      <p className="mt-4 text-gray-700">Choose your role to continue:</p>
      <div className="mt-4">
        <button onClick={() => setRole('student')} className="mr-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">Student</button>
        <button onClick={() => setRole('instructor')} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700">Instructor</button>
      </div>
    </div>
  );
}

export default Home;
