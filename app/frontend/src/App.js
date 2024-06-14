import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Home from './components/Home';
import About from './components/About';
import Contact from './components/Contact';
import CourseDetails from './components/CourseDetails';
import RecentTests from './components/RecentTests';
import InstructorHome from './components/InstructorHome';
import InstructorDashboard from './components/InstructorDashboard';
import StudentHome from './components/StudentHome';
import StudentDashboard from './components/StudentDashboard';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Authenticated from './components/Authenticated';
import { UserProvider, useUser } from './contexts/UserContext';

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
  const { user } = useUser();
  const location = useLocation();
  const [message, setMessage] = useState();

  const isLoginPage = location.pathname === '/login';

  return (
    <div className="flex min-h-screen bg-black text-white">
      {!isLoginPage && <Navbar />}
      <div className={`flex-grow flex flex-col ${!isLoginPage ? 'ml-64' : ''}`}>
        <div className="flex-grow p-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            {user?.role === 'student' && <Route path="/student/courses" element={<CourseDetails />} />}
            {user?.role === 'student' && <Route path="/student/dashboard" element={<StudentDashboard />} />}
            {user?.role === 'instructor' && <Route path="/instructor/courses" element={<CourseDetails />} />}
            {user?.role === 'instructor' && <Route path="/instructor/dashboard" element={<InstructorDashboard />} />}
            <Route path="/contact" element={<Contact />} />
            {user?.role === 'student' && <Route path="/student" element={<StudentHome />} />}
            {user?.role === 'instructor' && <Route path="/instructor" element={<InstructorHome />} />}
            <Route path="/course/:courseId" element={<CourseDetails />} />
            <Route path="/recent" element={<RecentTests />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
