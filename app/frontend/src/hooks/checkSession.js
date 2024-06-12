import { useEffect, useState } from 'react';
import { supabase } from '../helpers/supabaseConnection';

const useCheckSession = () => {
  const [session, setSession] = useState(null);

  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.log("Error getting session: ", error);
        setSession(false);
        return;
      }
      setSession(data.session ? true : false);
    };

    checkSession();
  }, []);

  return session;
};

export default useCheckSession;