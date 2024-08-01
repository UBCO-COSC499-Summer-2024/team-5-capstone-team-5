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
    <div className="border-b border-white text-white justify-end space-x-8 flex my-8 mt-8 m-12 w-full">
      {props.role === 2 && <NotificationBell userId={props.userId} notifications={props.notifications} fetchNotifications={props.fetchNotifications}/>}
        <div className="flex items-center">
          <button onClick={handleLogout} className="text-red-500 hover:text-red-700 mr-4">
            Logout
          </button>
        </div>
    </div>
  );
}

export default Header;
