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
    <div className="w-1/5 flex">
      <SignedOut>
      <SignInButton />
      </SignedOut>
    </div>
            
  );
};

export default Login;
