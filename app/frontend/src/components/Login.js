import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Email:', email);
    console.log('Password:', password);
    // Redirect to home page after login
    navigate('/');
  };

  return (
    <div className="h-full content-center">
      <div className="flex flex-col gap-16">
      <img src="/gradeit.svg" alt="Logo" className="w-2/5 flex self-center mb-12" />
        <SignedOut>
        <SignInButton className="text-xl flex justify-center self-center border-2 border-slate-800 rounded-full py-2 px-8" />
        </SignedOut>
      </div>
    </div>
            
  );
};

export default Login;
