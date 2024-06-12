import React from 'react'
import { AuthRedirect } from '../helpers/authUser'
import { supabase } from '../App'
import { Auth } from '@supabase/auth-ui-react';


const AuthPage = () => {
  AuthRedirect()

  return (
    <>
      <div className="authcontainer">
            <div>
            </div>
            <Auth
              supabaseClient={supabase}
              providers={['google', 'github']}
              view={'sign_in'}
              socialLayout="horizontal"
              socialButtonSize="xlarge"
            />
      </div>
    </>
  )
}

export default AuthPage