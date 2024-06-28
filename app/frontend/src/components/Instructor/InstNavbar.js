import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import getCourseData from '../../hooks/getCourseData';
import validateUser from '../../hooks/validateUser';
import AddCourseModal from './AddCourseModal';
import ProfileMenuModal from './ProfileMenuModal'; // Ensure the path is correct
import { useTheme } from '../../App'; // Adjust the path as needed

const InstNavbar = (props) => {
  const [courses, setCourses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'johndoe@example.com',
    image: 'https://via.placeholder.com/150', // Replace with actual user image URL
  });

  useEffect(() => {
    const checkSession = async () => {
      const session = await validateUser();
      if (!session) {
        navigate("/login");
      }
    };

    checkSession();
  }, [navigate]);

  const Logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const fetchData = async () => {
    try {
      if (props.id) {
        const courseData = await getCourseData(props.id);
        setCourses(courseData || []); // Ensure courses is always an array
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      setCourses([]); // Fallback to an empty array in case of an error
    }
  };

  useEffect(() => {
    fetchData();
  }, [props.id]);

  const handleAddCourse = async (data) => {
    console.log("data: ", data);
    const name = data.courseDept + " " + data.courseCode + "-" + data.courseSection;
    const description = data.description;
    const endDate = data.endDate;
    const newCourse = { name: name, description: description, end_date: endDate, user_id: props.id };
    console.log("newCourse: ", newCourse);
    try {
      const response = await fetch('http://localhost/api/users/courses/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCourse),
      });
      if (response.ok) {
        const addedCourse = await response.json();
        console.log("addedCourse:", addedCourse);
        setCourses([...courses, addedCourse]);
      } else {
        console.error('Error adding course:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error adding course:', error);
    }
  };

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
            <h2 className="ml-4 text-lg font-bold text-gray-300">Courses</h2>
            <ul className="mt-4 space-y-4">
              {courses.length > 0 ? courses.map((course) => (
                <li key={course.course_id}>
                  <NavLink
                    to={`/instructor/course/${course.course_id}`}
                    className={({ isActive }) =>
                      isActive
                        ? `block p-4 mx-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-300 hover:bg-gray-400'}`
                        : `block p-4 mx-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`
                    }
                  >
                    <h3 className="font-bold">{course.name}</h3>
                    <p className={`text-gray-400`}>{course.description}</p>
                    <p className="text-gray-500">Ends: {course.end_date.slice(0, 10)}</p>
                  </NavLink>
                </li>
              )) : (
                <li className="text-center text-gray-400">No courses available</li>
              )}
              <li
                className={`block p-4 mx-4 rounded-lg hover:bg-gray-600 text-white font-bold text-center cursor-pointer ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-300'} relative`}
                onClick={() => setIsModalOpen(true)}
              >
                <div className="text-xl">+</div>
                <div className="tooltip absolute bottom-[-1.5rem] left-1/2 transform -translate-x-1/2 bg-black text-white p-1 rounded opacity-0 transition-opacity duration-300">
                  Add Course
                </div>
              </li>
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
          className={`flex items-center mb-4 cursor-pointer hover:bg-gray-700 p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-black'}`}
        >
          <img src={user.image} alt="User" className="w-10 h-10 rounded-full mr-4" />
          <div>
            <p className="text-sm font-bold">{user.name}</p>
            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{user.email}</p>
          </div>
        </button>
        <ProfileMenuModal
          isOpen={isProfileMenuOpen}
          onClose={() => setIsProfileMenuOpen(false)}
          user={user}
          onLogout={Logout}
        />
      </div>
      <AddCourseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddCourse={handleAddCourse}
      />
    </div>
  );
};

export default InstNavbar;
