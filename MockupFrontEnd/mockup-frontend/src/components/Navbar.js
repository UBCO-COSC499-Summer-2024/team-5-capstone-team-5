import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

const Navbar = () => {
  const { role } = useUser();

  return (
    <div className="navbar bg-blue-900 text-white h-screen p-4 flex flex-col">
      <div className="mb-8">
        <ul className="space-y-4">
          <li><Link to="/" className="text-xl hover:text-gray-300">Home</Link></li>
          <li><Link to="/about" className="text-xl hover:text-gray-300">About</Link></li>
          {role === 'student' && (
            <>
              <li><Link to="/student/dashboard" className="text-xl hover:text-gray-300">Dashboard</Link></li>
              <li><Link to="/student/courses" className="text-xl hover:text-gray-300">Courses</Link></li>
            </>
          )}
          {role === 'instructor' && (
            <>
              <li><Link to="/instructor/dashboard" className="text-xl hover:text-gray-300">Dashboard</Link></li>
              <li><Link to="/instructor/courses" className="text-xl hover:text-gray-300">Manage Courses</Link></li>
            </>
          )}
          <li><Link to="/contact" className="text-xl hover:text-gray-300">Contact</Link></li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
