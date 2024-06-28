import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import getCourseData from '../hooks/getCourseData';
import validateUser from '../hooks/validateUser';


const Navbar = (props) => {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

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

    console.log("Before logout: ",localStorage.getItem("token"));
    localStorage.removeItem("token");
    console.log("After logout: ",localStorage.getItem("token"));
    navigate("/login");

  };

  useEffect( () => {
    const fetchData = async () => {
      if(props.id) {
        const courseData = await getCourseData(props.id);
        console.log(courseData);
        setCourses(courseData);
      }
    }
    fetchData();
  }, [props.id]);

  if(props.id) {
    return (
      <div className="h-full w-64 bg-gray-800 text-white flex flex-col justify-between fixed overflow-scroll">
        <div>
          <nav>
            <div className="pb-2 sticky top-0 bg-gray-900 pt-8">
              <img src={`${process.env.PUBLIC_URL}/gradeit.svg`} alt="Logo" className="w-48 mx-auto" />
              <NavLink
                to="/recent"
                className={({ isActive }) => isActive ? "block mt-4 mx-4 py-2 px-4 mb-2 rounded-lg bg-gray-700 text-white font-bold" : "block mt-4 mx-4 py-2 px-4 mb-2 rounded-lg text-gray-300 hover:bg-gray-600 hover:text-white"}
              >
                Recent Courses
              </NavLink>
            </div>
            <div className="mt-4">
              <h2 className=" ml-4 text-lg font-bold text-gray-300">Courses</h2>
              <ul className="mt-4 space-y-4">
                {courses.map((course) => {
                  return (
                    <li key={course.course_id}>
                      <NavLink
                        to={`/student/course/${course.course_id}`}
                        className={({ isActive }) => isActive ? "block bg-gray-700 p-4 mx-4 rounded-lg hover:bg-gray-600" : "block bg-gray-800 p-4 mx-4 rounded-lg hover:bg-gray-600"}
                      >
                        <h3 className="text-white font-bold">{course.name}</h3>
                        <p className="text-gray-400">{course.description}</p>
                        <p className="text-gray-500">Ends: {course.end_date.slice(0, 10)}</p>
                      </NavLink>
                    </li>
                  )
                })}
                {/* Add more courses as needed */}
              </ul>
            </div>
          </nav>
        </div>
        <div className="flex flex-col p-4 sticky bottom-0 bg-gray-900">
          <NavLink
            to="/about"
            className={({ isActive }) => isActive ? "block py-2 px-4 mb-2 rounded-lg bg-gray-700 text-white font-bold" : "block py-2 px-4 mb-2 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white"}
          >
            About
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) => isActive ? "block py-2 px-4 mb-2 rounded-lg bg-gray-700 text-white font-bold" : "block py-2 px-4 mb-2 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white"}
          >
            Contact
          </NavLink>
          <button onClick={Logout}><p className="block py-2 px-4 mb-2 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white text-left">Log out</p></button>
          <div className="mt-auto">
          </div>
        </div>
      </div>
      );
    } else {
      return null;
    }
  };

export default Navbar;