// src/components/Header.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import NotificationBell from './Instructor/NotificationBell';

const Header = (props) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate('/login'); // Redirect to login page after logout
  };

  return (
    <div className="border-b border-white text-white justify-end flex my-8 mx-12">
      {props.role === 2 && <NotificationBell userId={props.userId}/>}
        <div className="flex items-center">
          <button onClick={handleLogout} className="text-red-500 hover:text-red-700 mr-4">
            Logout
          </button>
        </div>
    </div>
  );
}

export default Header;
