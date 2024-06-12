import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useCheckSession from '../hooks/checkSession';

const Contact = () => {
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
    <div className="contact p-8 bg-white shadow rounded">
      <h1 className="text-4xl font-bold text-blue-900">Contact Us</h1>
      <p className="mt-4 text-gray-700">Email: support@gradeitomr.com</p>
    </div>
  );
}

export default Contact;
