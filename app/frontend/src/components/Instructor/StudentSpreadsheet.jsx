import React, { useEffect, useState, useCallback } from 'react';
import getStudentData from '../../hooks/getStudentData';
import { useTheme } from '../../App';
import validateUser from '../../hooks/validateUser';
import { NavLink, useNavigate } from 'react-router-dom';
import getUserInfo from '../../hooks/getUserInfo';
import ScanView from './ScanView';
import ParseStudentGrades from './ParseStudentGrades.jsx'

function StudentSpreadsheet(props) {
    const navigate = useNavigate();
    const [gradeList, setGradeList] = useState(null);
    const [isScanViewOpen, setIsScanViewOpen] = useState(true);
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
            setGradeList(await (getGrades(props.courseId)));
          }
        };
    
        checkSession();
    }, [navigate]);

    let grades = gradeList ? ParseStudentGrades(gradeList).grades : null;
    let exams = gradeList ? ParseStudentGrades(gradeList).exams : null;

    return (<>

    <table>
        <thead>
            {createHeaders(exams, theme)}
        </thead>
        <tbody>
            {createRows(grades, theme, props.courseId, setIsScanViewOpen, isScanViewOpen)}
        </tbody>

    </table>
    <p className = "mt-[5px]">Course ID: {props.courseId}</p>
    <p className = "mt-[5px]">Instructor name: {userInfo.name}</p>
    <p className = "mt-[5px]">Instructor ID: {userInfo.id}</p>
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

function createHeaders(exams, theme) {
    if(exams) {
        //const distinctExams = getColumns(grades);
        //distinctExams.sort((a, b) => {return (a.examId-b.examId);});
        const examColumns = exams.map(exam => {
            return(<th key = {exam.examId} className={`p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-300 text-black'}`}>{exam.examName}</th>);
        });
        return (
            <tr key = "Header" >
                <th key = "StudentId" className={`p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-300 text-black'}`}>Student ID</th>
                <th key = "Last Name" className={`p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-300 text-black'}`}>Last Name</th>
                <th key = "First Name" className={`p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-300 text-black'}`}>First Name</th>
                {examColumns}
            </tr>
        );
    } else {
        //console.log("Error creating table headers");
        return null;
        
    }
}

function createRows(grades, theme, course, setIsScanViewOpen, isScanViewOpen) {
    if(grades) {
        let rows = [];
        for(let i = 0; i < grades.length; i++) {
            rows.push(createSingleRow(grades[i], theme, course, setIsScanViewOpen, isScanViewOpen));
        }
        return rows;
    } else {
        //console.log("Error creating rows");
        return null;
    }
}

function createSingleRow(studentGrades, theme, course, setIsScanViewOpen, isScanViewOpen) {
    if(studentGrades) {
        const clickHandler = (examId, studentScore, userId, isScanViewOpen) => {
            setIsScanViewOpen(true);
            console.log(`Clicked student ${userId} on exam ${examId} with score ${studentScore}`);
        }

        const studentGradeList = studentGrades.scores.map(grade => {
            //<ScanView isOpen = {isScanViewOpen} studentId = {grade.userId} exam = {grade.examId} course = {course}/>
            return( <>
                    <td
                        onClick = { () => clickHandler(grade.examId, grade.studentScore, studentGrades.userId)} 
                        className="p-4  hover:bg-black/10">{grade.studentScore}
                    </td>
                </>);
        });

        return (
            <tr key = {studentGrades.userId} className={`rounded-lg ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'}`}>
                <td className="p-4">{String(studentGrades.userId).padStart(8,"0")}</td>
                <td className="p-4">{studentGrades.lastName}</td>
                <td className="p-4">{studentGrades.firstName}</td>
                {studentGradeList}
            </tr>
        );
    } else {
        return null;
    }
}

export default StudentSpreadsheet;
