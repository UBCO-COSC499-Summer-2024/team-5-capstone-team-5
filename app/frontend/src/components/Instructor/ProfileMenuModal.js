import React from 'react';

const ProfileMenuModal = ({ isOpen, onClose, user, onLogout }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 text-white rounded-lg p-4 w-80">
        <div className="flex items-center mb-4">
          <img src={user.image} alt="User" className="w-16 h-16 rounded-full mr-4" />
          <div>
            <p className="text-lg font-bold">{user.name}</p>
            <p className="text-sm text-gray-400">{user.email}</p>
          </div>
        </div>
        <button
          className="block w-full py-2 px-4 mb-2 rounded-lg bg-gray-700 text-white text-left"
          onClick={() => console.log('Change Password')}
        >
          Change Password
        </button>
        <button
          className="block w-full py-2 px-4 mb-2 rounded-lg bg-gray-700 text-white text-left"
          onClick={() => console.log('Change Theme')}
        >
          Change Theme
        </button>
        <button
          onClick={onLogout}
          className="block w-full py-2 px-4 mb-2 rounded-lg bg-gray-700 text-white text-left"
        >
          Log out
        </button>
        <button
          onClick={onClose}
          className="block w-full py-2 px-4 mb-2 rounded-lg bg-red-700 text-white text-left"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ProfileMenuModal;
