import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import getCourseData from '../../hooks/getCourseData';


const Navbar = () => {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();
  const session = useValidateUser(); // Call the custom hook here

  useEffect(() => {
    if (!session) {
      navigate("/login");
    }
  }, [session, navigate]);

  const Logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  }

  useEffect(() => {
    const fetchData = async () => {
      const courseData = await getCourseData('1');
      setCourses(courseData);
    }
    fetchData();
  }, []);

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
              {courses.map((course) => (
                <li key={course.course_id}>
                  <NavLink
                    to={`/course/${course.course_id}`}
                    className={({ isActive }) => isActive ? "block bg-gray-700 p-4 mx-4 rounded-lg hover:bg-gray-600" : "block bg-gray-800 p-4 mx-4 rounded-lg hover:bg-gray-600"}
                  >
                    <h3 className="text-white font-bold">{course.name}</h3>
                    <p className="text-gray-400">{course.description}</p>
                    <p className="text-gray-500">Ends: {course.end_date.slice(0, 10)}</p>
                  </NavLink>
                </li>
              ))}
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
        <button className="block py-2 px-4 mb-2 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white" onClick={Logout}>Logout</button>
      </div>
    </div>
  );
}

export default Navbar;
