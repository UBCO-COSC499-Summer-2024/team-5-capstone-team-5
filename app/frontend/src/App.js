import React, { useEffect, useState, createContext, useContext } from 'react';
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
//admin
import AdminDashboard from './components/Admin/AdminDashboard';
import AdminNavbar from './components/Admin/AdminNavbar';
import UserList from './components/Admin/UserList';
import RecentChanges from './components/Admin/RecentChanges';
import SiteStatistics from './components/Admin/SiteStatistics';

import StudentList from './components/Instructor/StudentList';
import Navbar from './components/Navbar';
import InstNavbar from './components/Instructor/InstNavbar';
import getUserInfo from './hooks/getUserInfo';
import { ConfigProvider, theme as antdTheme } from 'antd';
import ExamDetails from './components/ExamDetails';
import TestDescription from './components/Instructor/TestDescription'; // Corrected path
import './index.css';
import ChangePass from './components/ChangePass';


const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

function App() {
  const [theme, setTheme] = useState('dark');

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <ConfigProvider
        theme={{
          algorithm: theme === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
          token: {
            colorBgContainer: theme === 'dark' ? '#000000' : '#ffffff',
          },
        }}
      >
        <Router>
          <AppRoutes />
        </Router>
      </ConfigProvider>
    </ThemeContext.Provider>
  );
}

function AppRoutes() {
  const [role, setRole] = useState('');
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const hideNavbarPaths = ['/login'];
  const { theme } = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      const user = await getUserInfo();                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
      if (user) {
        setRole(user.role);
        setUserId(user.userId);
        console.log(user.role);
        console.log(user.userId);
      }
      setLoading(false);
    };
    fetchData();
  }, [location]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={`flex min-h-screen ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'}`}>
      {!hideNavbarPaths.includes(location.pathname) && role === 1 && <Navbar id={userId} />}
      {!hideNavbarPaths.includes(location.pathname) && role === 2 && <InstNavbar id={userId} />}
      {!hideNavbarPaths.includes(location.pathname) && role === 3 && <AdminNavbar id={userId} />}

      <div className="flex-grow flex flex-col ml-64">
        <div className="flex-grow p-8">
          <Routes>
          
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            {role === 1 && <Route path="/student/course/:courseId" element={<CourseDetails />} />}
            {role === 1 && <Route path="/student/exam/:examId" element={<ExamDetails id={userId} />} />}
            {role === 1 && <Route path="/student/dashboard" element={<StudentDashboard />} />}
            {role === 2 && <Route path="/instructor/course" element={<InstructorCourseList />} />}
            {role === 2 && <Route path="/instructor/dashboard" element={<InstructorDashboard />} />}
            {role === 2 && <Route path="/instructor/course/:courseId/*" element={<InstructorCourseDetails />} />}
           
            <Route path="/contact" element={<Contact />} />
            {role === 1 && <Route path="/student" element={<StudentHome />} />}
            <Route path="/recent" element={<RecentTests id={userId} />} />
            <Route path="/instructor/course/:courseId/test/:testId" element={<TestDescription />} />
            <Route path="/changePassword" element={<ChangePass id={userId} />} />

            
            {role === 3 && <Route path="/admin/dashboard" element={<AdminDashboard/>} />}
            {role === 3 && <Route path="/admin/user" element={<UserList/>} />}
            {role === 3 && <Route path="/admin/recentchanges" element={<RecentChanges/>} />}
            {role === 3 && <Route path="/admin/sitestatistics" element={<SiteStatistics/>}/>} 
          
          
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
