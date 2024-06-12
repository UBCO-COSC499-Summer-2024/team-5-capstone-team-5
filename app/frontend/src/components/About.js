import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useCheckSession from '../hooks/checkSession';


const About = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const session = useCheckSession();
  
  useEffect(() => {
    if (session === null) {
     
      setLoading(true);
    } else if (session === false) {
     
      navigate("/login");
    } else {
     
      setLoading(false);
    }
  }, [session, navigate]);

  if(loading) {
    return <div>Loading...</div>
  }
  return (
    <div className="about p-8 bg-white shadow rounded w-3/5">
      <h1 className="text-4xl font-bold text-blue-900">About Us</h1>
      <p className="mt-4 text-gray-700">GradeIT OMR Technologies is an innovative platform providing advanced OMR solutions for educational institutions...</p>
    </div>
  );
}

export default About;
