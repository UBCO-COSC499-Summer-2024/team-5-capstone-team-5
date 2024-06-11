import React from 'react';
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
import './index.css';

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
  return (
    <div className="flex">
      <Navbar />
      <div className="flex-grow p-8 ml-64"> {/* Added ml-64 to offset the fixed navbar */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Home />} />
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
    </div>
  );
}

export default App;
