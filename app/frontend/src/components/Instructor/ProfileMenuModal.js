import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '../../App'; // Adjust the path as needed
import { useNavigate } from 'react-router-dom';

const ProfileMenuModal = ({ isOpen, onClose, user, onLogout }) => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className={`rounded-lg p-4 w-80 relative ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-200"
        >
          ×
        </button>
        <div className="flex items-center mb-4">
          <img src={user.image} alt="User" className="w-16 h-16 rounded-full mr-4" />
          <div>
            <p className="text-lg font-bold">{user.name}</p>
            <p className="text-sm text-gray-400">{user.email}</p>
          </div>
        </div>
        <button
          className={`block w-full py-2 px-4 mb-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-300 text-black'} text-left`}
          onClick={() => {navigate('/changePassword'); onClose;}}
        >
          Change Password
        </button>
        <div className="flex items-center justify-between py-2 px-4 mb-2 rounded-lg">
          <span className="font-bold">Change Theme</span>
          <div className="flex items-center">
            <FontAwesomeIcon icon={faSun} className="mr-2" />
            <label className="relative inline-flex cursor-pointer items-center">
              <input id="theme-switch" type="checkbox" className="sr-only peer" checked={theme === 'dark'} onChange={toggleTheme} />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
            </label>
            <FontAwesomeIcon icon={faMoon} className="ml-2" />
          </div>
        </div>
        <button
          onClick={onLogout}
          className="block w-full py-2 px-4 mb-2 rounded-lg bg-red-700 text-white text-left"
        >
          Log out
        </button>
      </div>
    </div>
  );
};

export default ProfileMenuModal;
