
/**
 * Custom hook to validate user session.
 * @returns {Object|null} The user session object if valid, otherwise null.
 */
import { useEffect, useState } from 'react';

const useValidateUser = () => {
  const [session, setSession] = useState(null);

  useEffect(() => {
    const validateUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setSession(null);
          return;
        }

        const response = await fetch('http://localhost/api/auth/verify', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setSession(data);
        } else {
          setSession(null);
        }
      } catch (error) {
        console.error('Error verifying user', error);
        setSession(null);
      }
    };

    validateUser();
  }, []);

  return session;
};

export default useValidateUser;
