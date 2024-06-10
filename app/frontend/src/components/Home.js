import React, { useEffect, useState } from 'react';


function Home() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('http://localhost:80/')
      .then(response => setMessage(response.data))
      .catch(error => console.error(error));
  }, []);

  return (
    <div>
      <h1>{message}</h1>
    </div>
  );
}

export default Home;
