import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


const Login = () => {
  const navigate = useNavigate();


  return (
    <div className="h-full content-center bg-[#1D1E21]">
      <div className="flex flex-col gap-16">
        <img src="/gradeit.svg" alt="Logo" className="w-2/5 flex self-center mb-12" />
        <div className="w-2/5 self-center">
        </div>
      </div>
    </div>
            
  );
};

export default Login;
