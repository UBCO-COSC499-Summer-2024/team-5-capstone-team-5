import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import './index.css';  // Make sure this file contains Tailwind directives and configurations

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
  const [message, setMessage] = useState();

  useEffect(() => {
    fetch("/api/")
      .then(res => res.json())
      .then(res => setMessage(res.message))
      .catch(console.error);
  }, [setMessage]);

  return (
    <div className="flex">
      <Navbar />
      <div className="flex-grow p-8 ml-64">
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
          <Route path="/course/:courseId" element={<CourseDetails />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
