import React, { useEffect, useState } from 'react';


function Home() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('http://localhost:80/')
      .then(response => setMessage(response.data))
      .catch(error => console.error(error));
  }, []);

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
