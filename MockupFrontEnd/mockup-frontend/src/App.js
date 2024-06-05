import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Home from './components/Home';
import About from './components/About';
import Contact from './components/Contact';
import CourseDetails from './components/CourseDetails';
import InstructorHome from './components/InstructorHome';
import StudentHome from './components/StudentHome';
import Login from './components/Login';
import Navbar from './components/Navbar';
import { UserProvider, useUser } from './contexts/UserContext';
import './App.css';

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
  const location = useLocation();
  const { role } = useUser();
  const isCoursesPage = location.pathname === "/student/courses" || location.pathname === "/instructor/courses";
  const showNavbar = location.pathname !== "/";

  return (
    <div className="flex">
      {showNavbar && <Navbar />}
      <div className={isCoursesPage ? "flex-grow" : "flex-grow p-8"}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          {role === 'student' && <Route path="/student/courses" element={<CourseDetails />} />}
          {role === 'instructor' && <Route path="/instructor/courses" element={<CourseDetails />} />}
          <Route path="/contact" element={<Contact />} />
          {role === 'student' && <Route path="/student" element={<StudentHome />} />}
          {role === 'instructor' && <Route path="/instructor" element={<InstructorHome />} />}
        </Routes>
      </div>
    </div>
  );
}

export default App;
