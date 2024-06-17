
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Home from './components/Home';
import About from './components/About';
import Contact from './components/Contact';
import CourseDetails from './components/CourseDetails';
import RecentTests from './components/RecentTests';
import StudentHome from './components/StudentHome';
import StudentDashboard from './components/StudentDashboard';
import Login from './components/Login';
import { UserProvider, useUser } from './contexts/UserContext';
import InstructorDashboard from './components/Instructor/InstructorDashboard';
import InstructorCourseList from './components/Instructor/InstructorCourseList';
import InstructorCourseDetails from './components/Instructor/InstructorCourseDetails';
import StudentList from './components/Instructor/StudentList';
import Navbar from './components/Navbar';
import getRole from './hooks/getRole';

function App() {

  return (
    <UserProvider>
      <Router>
        <AppRoutes />
      </Router>
    </UserProvider>
  );
}

function AppRoutes() {
  const [role, setRole] = useState('');
  const location = useLocation();
  const hideNavbarPaths = ['/login'];

  useEffect(() => {
    const fetchRole = async () => {
      const userRole = await getRole();
      setRole(userRole);
    };
    fetchRole();
  }, [location]);


  return (
    <div className="flex min-h-screen bg-black text-white">
      {!hideNavbarPaths.includes(location.pathname) && <Navbar />}
      <div className="flex-grow flex flex-col ml-64">
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
            {/*role === 'instructor' && <Route path="/instructor" element={<InstructorHome />} />*/}
            <Route path="/course/:courseId" element={<CourseDetails />} />
            <Route path="/recent" element={<RecentTests />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
