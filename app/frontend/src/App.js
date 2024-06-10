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
import { UserProvider, useUser } from './contexts/UserContext';
import './App.css';
import { useSession } from "@clerk/clerk-react";




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
  const { isLoaded, session, isSignedIn } = useSession();
  const { role } = useUser();

  return (
    <div className="flex">
      <Navbar />
      <div className="h-screen w-screen">
        <Routes>
          <Route path="/" element={isSignedIn ? <Home /> : <Login />} />
          <Route path="/about" element={isSignedIn ? <About /> : <Login />} />
          <Route path="/login" element={<Login />} />
          {role === 'student' && <Route path="/student/courses" element={isSignedIn ? <CourseDetails /> :<Login />} />}
          {role === 'student' && <Route path="/student/dashboard" element={isSignedIn ? <StudentDashboard /> : <Login />} />}
          {role === 'instructor' && <Route path="/instructor/courses" element={isSignedIn ? <CourseDetails /> : <Login />} />}
          {role === 'instructor' && <Route path="/instructor/dashboard" element={isSignedIn ? <InstructorDashboard /> : <Login />} />}
          <Route path="/contact" element={isSignedIn ? <Contact /> : <Login />} />
          {role === 'student' && <Route path="/student" element={isSignedIn ? <StudentHome /> : <Login />} />}
          {role === 'instructor' && <Route path="/instructor" element={isSignedIn ? <InstructorHome /> : <Login />} />}
        </Routes>
      </div>
    </div>
  );
}

export default App;
