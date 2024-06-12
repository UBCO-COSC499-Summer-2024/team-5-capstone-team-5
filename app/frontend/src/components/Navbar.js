import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { supabase } from '../helpers/supabaseConnection';
import { useNavigate } from 'react-router-dom';


const Navbar = () => {
  const navigate = useNavigate();
  const [signedIn, setSignedIn] = useState(null);
  const { role } = useUser();

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if(error) {
      console.log("There was an error with the signout process: ", error);
    }
    else {
      setSignedIn(false);
      navigate("/login");
    }
  }
  const checkSession = async () => {
    const { data, error } = await supabase.auth.getSession();
    if(error) {
      console.log("Error getting session: ", error);
    }
    if(data.session) {
      setSignedIn(true);
    }
    else {
      setSignedIn(false);
    }
  }
  useEffect(() => {
    checkSession();
  });

  return (
    <div className={"navbar bg-blue-900 text-white h-screen p-4 flex-col " + (signedIn ? 'flex' : 'hidden')}>
      <div className="mb-8">
        <ul className="space-y-4">
          <li><Link to="/" className="text-xl hover:text-gray-300">Home</Link></li>
          <li><Link to="/about" className="text-xl hover:text-gray-300">About</Link></li>
          {role === 'student' && (
            <>
              <li><Link to="/student/dashboard" className="text-xl hover:text-gray-300">Dashboard</Link></li>
              <li><Link to="/student/courses" className="text-xl hover:text-gray-300">Courses</Link></li>
            </>
          )}
          {role === 'instructor' && (
            <>
              <li><Link to="/instructor/dashboard" className="text-xl hover:text-gray-300">Dashboard</Link></li>
              <li><Link to="/instructor/courses" className="text-xl hover:text-gray-300">Manage Courses</Link></li>
            </>
          )}
          <li><Link to="/contact" className="text-xl hover:text-gray-300">Contact</Link></li>
          <li>
          <button onClick={signOut} className="text-xl hover:text-gray-300">Sign Out</button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
