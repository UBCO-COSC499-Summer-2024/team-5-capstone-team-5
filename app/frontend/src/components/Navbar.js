import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import getCourseData from '../hooks/getCourseData';
import validateUser from '../hooks/validateUser';
import ProfileMenuModal from './ProfileMenuModal'; // Ensure the path is correct
import { useTheme } from '../App'; // Adjust the path as needed
import getUserInfo from '../hooks/getUserInfo';

const Navbar = (props) => {
  const [courses, setCourses] = useState([]);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'johndoe@example.com',
    image: 'https://via.placeholder.com/150', // Replace with actual user image URL
    role: 1 // Default role
  });

  useEffect(() => {
    const checkSession = async () => {
      const session = await validateUser();
      if (!session) {
        navigate("/login");
      } else {
        const userInfo = await getUserInfo();
        console.log(userInfo);
        setUser({
          name: userInfo.name,
          email: userInfo.userEmail,
          image: 'https://via.placeholder.com/150',
          role: userInfo.role // Set the role from userInfo
        });
      }
    };

    checkSession();
  }, [navigate]);

  const Logout = () => {
    console.log("Before logout: ", localStorage.getItem("token"));
    localStorage.removeItem("token");
    console.log("After logout: ", localStorage.getItem("token"));
    navigate("/login");
  };

  useEffect(() => {
    const fetchData = async () => {
      if (props.id) {
        const courseData = await getCourseData(props.id);
        console.log(courseData);
        setCourses(courseData);
      }
    }
    fetchData();
  }, [props.id]);

  const getRoleName = (role) => {
    switch (role) {
      case 1:
        return 'Student';
      case 2:
        return 'Instructor';
      default:
        return 'Unknown Role';
    }
  };

  if (props.id) {
    return (
      <div className={`h-full w-64 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-black'} flex flex-col justify-between fixed overflow-scroll`}>
        <div>
          <nav>
            <div className={`pb-2 sticky top-0 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-300'} pt-8`}>
              <img src={`${process.env.PUBLIC_URL}/gradeit.svg`} alt="Logo" className="w-48 mx-auto" />
              <NavLink
                to="/recent"
                className={({ isActive }) =>
                  isActive
                    ? `block mt-4 mx-4 py-2 px-4 mb-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-400 text-black'} font-bold`
                    : `block mt-4 mx-4 py-2 px-4 mb-2 rounded-lg ${theme === 'dark' ? 'text-gray-300 hover:bg-gray-600 hover:text-white' : 'text-black hover:bg-gray-400 hover:text-black'}`
                }
              >
                Recent Courses
              </NavLink>
            </div>
            <div className="mt-4">
              <h2 className={`ml-4 text-lg font-bold ${theme === 'dark' ? 'text-gray-300' : 'text-black'}`}>Courses</h2>
              <ul className="mt-4 space-y-4">
                {courses.map((course) => {
                  return (
                    <li key={course.course_id}>
                      <NavLink
                        to={`/student/course/${course.course_id}`}
                        className={({ isActive }) =>
                          isActive
                            ? `block p-4 mx-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-400 text-black hover:bg-gray-500'}`
                            : `block p-4 mx-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800 text-white hover:bg-gray-600' : 'bg-gray-200 text-black hover:bg-gray-300'}`
                        }
                      >
                        <h3 className="font-bold">{course.name}</h3>
                        <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-black'}`}>{course.description}</p>
                        <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Ends: {course.end_date.slice(0, 10)}</p>
                      </NavLink>
                    </li>
                  )
                })}
              </ul>
            </div>
          </nav>
        </div>
        <div className={`flex flex-col p-4 sticky bottom-0 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-300'}`}>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive
                ? `block py-2 px-4 mb-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-400 text-black'} font-bold`
                : `block py-2 px-4 mb-2 rounded-lg ${theme === 'dark' ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-black hover:bg-gray-400 hover:text-black'}`
            }
          >
            About
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              isActive
                ? `block py-2 px-4 mb-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-400 text-black'} font-bold`
                : `block py-2 px-4 mb-2 rounded-lg ${theme === 'dark' ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-black hover:bg-gray-400 hover:text-black'}`
            }
          >
            Contact
          </NavLink>
          <button
            onClick={() => setIsProfileMenuOpen(true)}
            className={`flex items-center mb-4 cursor-pointer p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-gray-200 text-black hover:bg-gray-300'}`}
          >
            <img src={user.image} alt="User" className="w-10 h-10 rounded-full mr-4" />
            <div>
              <p className="text-sm font-bold">{user.name}</p>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{user.email}</p>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{getRoleName(user.role)}</p>
            </div>
          </button>
          <ProfileMenuModal
            isOpen={isProfileMenuOpen}
            onClose={() => setIsProfileMenuOpen(false)}
            user={user}
            onLogout={Logout}
          />
        </div>
      </div>
    );
  } else {
    return null;
  }
};

export default Navbar;
