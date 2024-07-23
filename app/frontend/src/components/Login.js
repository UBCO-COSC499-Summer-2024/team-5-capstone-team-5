// app/frontend/src/components/Login.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons';
import Toast from './Toast'; // Importing the Toast component
import { useTheme } from '../App'; // Ensure this path is correct

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const { theme } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      });

      if (response.status === 200) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        setToast({ show: true, message: 'Login successful!', type: 'success' });
        setTimeout(() => {
          navigate('/');
        }, 3000); // Navigate after showing the success message
      } else if (response.status === 401) {
        setToast({ show: true, message: 'Incorrect Credentials', type: 'error' });
      } else if (response.status === 404) {
        setToast({ show: true, message: 'Endpoint not found', type: 'error' });
      } else {
        setToast({ show: true, message: 'Login request unsuccessful', type: 'error' });
      }
    } catch (error) {
      setToast({ show: true, message: 'Internal Server Error', type: 'error' });
    }
  };

  return (
    <div className={`h-screen content-center ${theme === 'dark' ? 'bg-[#1D1E21] text-white' : 'bg-white text-black'}`}>
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ show: false, message: '', type: '' })}
        />
      )}
      <div className="flex flex-col gap-16 items-center justify-center min-h-screen">
        <img src="/gradeit.svg" alt="Logo" className="w-2/5 mb-8" />
        <form onSubmit={handleSubmit} className="w-full max-w-sm">
          <div className={`flex flex-col w-full px-8 py-6 rounded-lg shadow-lg ${theme === 'dark' ? 'bg-[#26272A]' : 'bg-gray-100'}`}>
            <label className="font-semibold mb-2">Email</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              placeholder="Enter your email" 
              className={`px-3 py-2 rounded-md mb-4 ${theme === 'dark' ? 'bg-[#1D1E21] text-white' : 'bg-white text-black'} shadow-inner`} 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="relative mb-4">
              <label className="font-semibold mb-2">Password</label>
              <input 
                type={showPassword ? "text" : "password"} 
                id="password" 
                name="password" 
                placeholder="Enter your password" 
                className={`px-3 py-2 rounded-md w-full ${theme === 'dark' ? 'bg-[#1D1E21] text-white' : 'bg-white text-black'} shadow-inner`} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="button" onClick={() => setShowPassword((prev) => !prev)} className="absolute right-3 top-10 transform -translate-y-1/2">
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className={`${theme === 'dark' ? 'text-[#32556F]' : 'text-gray-600'}`} />
              </button>
            </div>
            <button type="submit" className={`w-full py-2 rounded-md mt-4 font-semibold ${theme === 'dark' ? 'bg-[#293C4A] text-white hover:bg-[#32556F]' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
