// src/components/Header.js

import React from 'react';
import { SignedIn, UserButton } from "@clerk/clerk-react";
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Implement your logout logic here
    navigate('/login'); // Redirect to login page after logout
  };

  return (
    <div className="fixed top-0 left-0 w-full bg-gray-900 text-white flex justify-between items-center p-4 z-50">
      <div className="flex items-center">
        <img src={`${process.env.PUBLIC_URL}/gradeit.svg`} alt="Logo" className="w-32" />
      </div>
      <SignedIn>
        <div className="flex items-center">
          <button onClick={handleLogout} className="text-red-500 hover:text-red-700 mr-4">
            Logout
          </button>
          <UserButton />
        </div>
      </SignedIn>
    </div>
  );
};

export default Header;
