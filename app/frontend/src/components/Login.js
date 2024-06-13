import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


const Login = () => {
  const navigate = useNavigate();


  return (
    <div className="h-full content-center bg-[#1D1E21]">
      <div className="flex flex-col gap-16">
        <img src="/gradeit.svg" alt="Logo" className="w-2/5 flex self-center mb-12" />
        <form action="http://localhost:80/api/auth/login" method="post">
          <div className="flex justify-center">
            <div className="flex flex-col w-2/5 bg-[#26272A] px-8 py-4 rounded-lg drop-shadow-lg">
              <label className="text-white/80 font-semibold">Email</label>
              <input type="email" id="email" name="email" placeholder="Enter your email" className="px-2 rounded-md h-10 bg-[#1D1E21] my-2 text-sm shadow-inner" />
              <label className="text-white/80 font-semibold">Password</label>
              <input type="password" id="password" name="password" placeholder="Enter your password" className="px-2 rounded-md h-10 bg-[#1D1E21] my-2 text-sm shadow-inner" />
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
