// app/frontend/src/components/Navbar.js
import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';
import getCourseData from '../hooks/getCourseData';
import validateUser from '../hooks/validateUser';
import ProfileMenuModal from './ProfileMenuModal';
import { useTheme } from '../App';
import getUserInfo from '../hooks/getUserInfo';
import Avatar from './Avatar';
import Flip from './Flip'; // Import the Flip component

const Navbar = (props) => {
  const [courses, setCourses] = useState([]);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [avatarOptions, setAvatarOptions] = useState({ seed: 'initial' });
  const [flippedCourses, setFlippedCourses] = useState({});
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'johndoe@example.com',
    image: 'https://via.placeholder.com/150',
    role: 1
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
          role: userInfo.role
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
    };
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

  const handleFlipClick = (courseId) => {
    setFlippedCourses(prevState => ({
      ...prevState,
      [courseId]: !prevState[courseId]
    }));
  };

  if (props.id) {
    return (
      <div className={`h-full w-64 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-200 text-black'} flex flex-col fixed overflow-hidden`}>
        <div className={`pb-2 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-300'} pt-8`}>
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
        <div className="flex-grow overflow-y-auto mt-4">
          <h2 className={`ml-4 text-lg font-bold ${theme === 'dark' ? 'text-gray-300' : 'text-black'}`}>Courses</h2>
          <ul className="mt-4 space-y-4">
            {courses.map((course) => (
              <li key={course.course_id} className="relative">
                <div className="relative p-4 rounded-lg bg-gray-800 text-white shadow-md">
                  <Flip
                    course={course}
                    flipped={flippedCourses[course.course_id] || false}
                    handleFlipClick={() => handleFlipClick(course.course_id)}
                  />
                  <FontAwesomeIcon
                    icon={faEllipsis}
                    className="absolute top-4 right-4 cursor-pointer text-gray-600"
                    onClick={() => handleFlipClick(course.course_id)}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className={`p-4 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-300'}`}>
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
            <Avatar options={avatarOptions} size={32} />
            <div className="ml-2">
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
            onAvatarSelect={setAvatarOptions}
          />
        </div>
      </div>
    );
  } else {
    return null;
  }
};

export default Navbar;
