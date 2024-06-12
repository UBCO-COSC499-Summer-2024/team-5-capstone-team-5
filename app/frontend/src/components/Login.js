import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../helpers/supabaseConnection';
import { Auth } from '@supabase/auth-ui-react';
import { gradeItTheme } from '../constants/theme';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if(event === "SIGNED_IN") {
        navigate("/authenticated")
      }
    })
    }
  )

  return (
    <div className="h-full content-center bg-[#1D1E21]">
      <div className="flex flex-col gap-16">
        <img src="/gradeit.svg" alt="Logo" className="w-2/5 flex self-center mb-12" />
        <div className="w-2/5 self-center">
        <Auth 
          supabaseClient={supabase}
          appearance={{theme: gradeItTheme}}
          providers={[]}
          />
        </div>
      </div>
    </div>
            
  );
};

export default Login;
