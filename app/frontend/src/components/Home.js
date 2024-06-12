import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


function Home() {
  const [loading, setLoading] = useState(true); // This is a good example for how to handle loading instead of flashing the information
  const navigate = useNavigate();
  
 
  
  return (
    <div className="h-full content-center">
      <div className="flex flex-col gap-16">
      <img src="/gradeit.svg" alt="Logo" className="w-2/5 flex self-center mb-12" />
      <h1 className='flex self-center'>You are viewing the Home page</h1>
      </div>
    </div>
  );
}

export default Home;
