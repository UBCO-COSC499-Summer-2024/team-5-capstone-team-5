import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons';
import Toast from './Toast'; // Importing the Toast component

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

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
        }, 1000); // Navigate after showing the success message
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
    <div className="h-screen content-center bg-[#1D1E21]">
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ show: false, message: '', type: '' })}
        />
      )}
      <div className="flex flex-col gap-16">
        <img src="/gradeit.svg" alt="Logo" className="w-2/5 flex self-center mb-12" />
        <form onSubmit={handleSubmit}>
          <div className="flex justify-center">
            <div className="flex flex-col w-2/5 bg-[#26272A] px-8 py-4 rounded-lg drop-shadow-lg">
              <label className="text-white/80 font-semibold">Email</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                placeholder="Enter your email" 
                className="px-2 rounded-md h-10 bg-[#1D1E21] my-2 text-sm shadow-inner" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="relative flex flex-col">
              <label className="text-white/80 font-semibold">Password</label>
              <input 
                type={showPassword ? "text" : "password"} 
                id="password" 
                name="password" 
                placeholder="Enter your password" 
                className="px-2 rounded-md h-10 bg-[#1D1E21] my-2 text-sm shadow-inner" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="button" onClick={() => {setShowPassword((prev => !prev))}} className="absolute right-2 top-1/2 transform -translate-y-1/5"><FontAwesomeIcon icon={showPassword? faEyeSlash : faEye} className='text-[#32556F]' /></button>
              </div>
              <div className="flex flex-row justify-center">
                <button type="submit" className="bg-[#293C4A] w-full h-10 mt-6 rounded-md mb-2 hover:bg-[#32556F] font-semibold">Login</button>
              </div>
              <p>Don't have an account? <a href='/signup' className='underline'>Sign up</a></p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;

