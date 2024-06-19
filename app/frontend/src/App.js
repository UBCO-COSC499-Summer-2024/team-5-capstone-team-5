import React from 'react';
import { useState, useEffect } from "react";
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
import './App.css';
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import Footer from './components/Footer.js';



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
      <SignedOut>
      <SignInButton />
      </SignedOut>
      <SignedIn>
      <UserButton />
      </SignedIn>
      <div className="flex-grow p-8">
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
        </Routes>
      </div>
      <Footer>
      </Footer>
    </div>
  );
}

export default App;
