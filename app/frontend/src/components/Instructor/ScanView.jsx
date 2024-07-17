import React, { useEffect, useState, useCallback } from 'react';
import getStudentData from '../../hooks/getStudentData';
import { useTheme } from '../../App';
import validateUser from '../../hooks/validateUser';
import { NavLink, useNavigate } from 'react-router-dom';
import getUserInfo from '../../hooks/getUserInfo';

function ScanView(props) {
    const scanViewInfo = props.scanViewInfo;
    const [responses, setResponses] = useState(null);
    const navigate = useNavigate();
    //Stores information for the instructor which is currently signed in.
    const [userInfo, setUserInfo] = useState({
        name: "",
        id: 0,
    })
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
            setResponses(await getResponses(scanViewInfo.student, scanViewInfo.exam));
            }
        }
        checkSession();
    }, [navigate]);

    if(scanViewInfo.isOpen) {
        console.log(responses);
        return(<div className = "bg-[rgba(0,_0,_0,_0.07)] fixed top-[0%] left-[0%] w-[100%] h-[100%]">
            <div className = "bg-gray-800 fixed top-[30%] left-[30%] w-[40%] h-[40%] text-center overflow-y-scroll">
                <button onClick = {props.onClose}>Close</button>
                <p>Student Id: {scanViewInfo.student}</p>
                <p>Exam Id: {scanViewInfo.exam}</p>
                <p>Score: {scanViewInfo.score}</p>
                <p>Course Id: {scanViewInfo.course}</p>
                <p>Scan View is {scanViewInfo.isOpen ? "open" : "not open"}</p>
            </div>
        </div>)
    } else {
        return null;
    }
}

const getResponses = async (userId, examId) => {
    const response = await fetch(`HTTP://localhost/api/users/questions/${examId}&${userId}`);
    if(response.ok) {
        const selectedResponses = await response.json();
        return selectedResponses;
    } else {
        console.log(`Error retrieving responses for user: ${userId} on exam: ${examId}`);
        return null;
    }
}

export default ScanView;
