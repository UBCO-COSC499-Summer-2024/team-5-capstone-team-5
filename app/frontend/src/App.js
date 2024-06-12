import React from 'react';
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import Home from './components/Home';
import About from './components/About';
import Contact from './components/Contact';
import CourseDetails from './components/CourseDetails';
import InstructorHome from './components/InstructorHome';
import InstructorDashboard from './components/InstructorDashboard';
import StudentHome from './components/StudentHome';
import StudentDashboard from './components/StudentDashboard';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Authenticated from './components/Authenticated';
import { UserProvider, useUser } from './contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from './hooks/supabaseConnection';




function App() {
  return (
    <UserProvider>
      <Router>
        <AppContent />
      </Router>
    </UserProvider>
  );
}

function AppContent() {
  const { role } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const { data, error } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        console.log('SIGNED_OUT', session);
        
        // Clear local and session storage
        [window.localStorage, window.sessionStorage].forEach((storage) => {
          Object.entries(storage).forEach(([key]) => {
            storage.removeItem(key);
          });
        });
      }
      if (event === 'SIGNED_IN') {
        console.log('SIGNED_IN', session)
      }
    });
  }
)



  return (
    <div className="flex bg-[#1D1E21] text-white">
      <Navbar />
      <div className="h-screen w-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          {role === 'student' && <Route path="/student/courses" element={<CourseDetails />} />}
          {role === 'student' && <Route path="/student/dashboard" element={<StudentDashboard />} />}
          {role === 'instructor' && <Route path="/instructor/courses" element={<CourseDetails />} />}
          {role === 'instructor' && <Route path="/instructor/dashboard" element={<InstructorDashboard />} />}
          <Route path="/contact" element={<Contact />} />
          {role === 'student' && <Route path="/student" element={<StudentHome />} />}
          {role === 'instructor' && <Route path="/instructor" element={<InstructorHome />} />}
          <Route path="/authenticated" element={<Authenticated />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
