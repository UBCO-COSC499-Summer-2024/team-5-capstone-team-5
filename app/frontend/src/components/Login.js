import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useUser();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:80/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      });

      if(!response.ok) {
        const error = await response.text();
        console.error('Server response:',error);
        throw new Error('Login failed');
      }

      const data = await response.json();
      setUser({
        id: data.id,
        role: data.role,
        name: data.name,
        token: data.token
      });
      navigate('/'); // Navigating to home route after successful login
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="h-full content-center bg-[#1D1E21]">
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
              <label className="text-white/80 font-semibold">Password</label>
              <input 
                type="password" 
                id="password" 
                name="password" 
                placeholder="Enter your password" 
                className="px-2 rounded-md h-10 bg-[#1D1E21] my-2 text-sm shadow-inner" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="flex flex-row justify-center">
                <button type="submit" className="bg-[#293C4A] w-full h-10 rounded-md mt-6 mb-2 hover:bg-[#32556F] font-semibold">Login</button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
