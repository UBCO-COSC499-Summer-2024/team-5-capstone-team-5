import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useCheckSession from '../hooks/checkSession';

function Home() {
  const [loading, setLoading] = useState(true); // This is a good example for how to handle loading instead of flashing the information
  const navigate = useNavigate();
  const session = useCheckSession();
  
  useEffect(() => {
    if (session === null) {
      // Still checking the session
      setLoading(true);
    } else if (session === false) {
      // Session check complete and user is not authenticated
      navigate("/login");
    } else {
      // Session check complete and user is authenticated
      setLoading(false);
    }
  }, [session, navigate]);

  if(loading) { // Here is the div that is shown while the page loads because of the useEffect above. It resolves once it checks session and finds a session.
    return <div>Loading...</div>
  }
  
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
