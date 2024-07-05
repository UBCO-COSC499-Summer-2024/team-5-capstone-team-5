import React, { useEffect, useState, useCallback } from 'react';
import getStudentData from '../../hooks/getStudentData';
import { useTheme } from '../../App';
import validateUser from '../../hooks/validateUser';
import { NavLink, useNavigate } from 'react-router-dom';
import getUserInfo from '../../hooks/getUserInfo';

function StudentSpreadsheet(props) {
    const [courses, setCourses] = useState([]);
    const navigate = useNavigate();
    const [grades, setGrades] = useState(null);
    const [userInfo, setUserInfo] = useState({
        name: "",
        id: 0,
    });
    const { theme } = useTheme();

    useEffect(() => {
        const checkSession = async () => {
          const session = await validateUser();
          if (!session) {
            navigate("/login");
          } else {
            const info = await getUserInfo();
            setUserInfo({
                name: info.name,
                id: info.userId,
              });
            setGrades(await getGrades(props.courseId));
          }
        };
    
        checkSession();
    }, [navigate]);

    console.log(grades);


    return (<>
    <p>Course ID: {props.courseId}</p>
    <p>Instructor name: {userInfo.name}</p>
    <p>Instructor ID: {userInfo.id}</p>
    </>);
}

const getGrades = async (courseId) => {
    const response = await fetch(`HTTP://localhost/API/users/courses/grades/${courseId}`);
    if(response.ok) {
        const grades = await response.json();
        return grades;
    } else {
        console.log("Error retrieving grades");
        return null;
    }
};

export default StudentSpreadsheet;
