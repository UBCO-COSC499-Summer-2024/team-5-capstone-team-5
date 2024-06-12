import React, { useEffect, useState } from 'react';
import { supabase } from '../hooks/supabaseConnection';
import { useNavigate } from 'react-router-dom';


function Home() {
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if(event === "NOT_SIGNED_IN") {
        navigate("/login");
      }
    })
    }
  )
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
