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
    const [scanViewInfo, setScanViewInfo] = useState({
        isOpen: false,
        student:0,
        exam: 0,
        score: 0,
        course: 0,
    });
    //Stores information for the instructor which is currently signed in.
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
            //Queries the database to obtain the grades and exams for the course specified by courseId
            setGradeList(await (getGrades(props.courseId)));
          }
        };
    
        checkSession();
    }, [navigate]);

    let parsedGrades = gradeList ? ParseStudentGrades(gradeList) : null;
    /*Output from the query is parsed into an object containg an array of grades and an array of exams.
    Each grade element is an object containing student information, and all their scores in an attribute "scores"
    This attribute is an array of objects specifying a grade to for each marked exam specific to the student
    Any student who is missing tests should now have their scores padded with zero's in the "scores" attribute. 
    Grades is ordered by studentId.
    Exams is a smaller array which containing the distinct examID's (and their names) that have been marked.
    This will be used to make the header in the spreadsheet component. */
    let grades = gradeList ? parsedGrades.grades : null;
    let exams = gradeList ? parsedGrades.exams : null;
    console.log(gradeList);
    return (<>
        <table>
            <thead>
            {   createHeaders(exams, theme)}
            </thead>
            <tbody>
                {createRows(grades, theme, props.courseId, scanViewInfo, setScanViewInfo)}
            </tbody>
        </table>
        <p className = "mt-[5px]">Course ID: {props.courseId}</p>
        <p className = "mt-[5px]">Instructor name: {userInfo.name}</p>
        <p className = "mt-[5px]">Instructor ID: {userInfo.id}</p>
    </>);
}

/*
Returns an array of objects with the following structure:
userId, lastName, firstName, isRegistered, examId, examName, studentScore.
exams is an array of objects with the following structiure:
Notes:
 - isRegistereed is a boolean which is used to identify any students who 
completed exams for the specifed course, but haven'y yet been registered
 - studentScore currently SUMS the weights of questions for which the student's response
 matches the answer key.
 - Each element in this array should occupy one cell in the table, with the exception of the following case.
 - Any registered students which have failed to write any tests will show up with an examId of -1.
 Their scores for marked tests will later be paded with zeros by ParseStudentGrades.jsx
 - If a student writes some, but not all tests, only the tests they've written will be included.
*/
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

/* Creates the header row for the spreadsheet. By using exams as an argument, it is able
to create columns dynamically. Columns are only created for exams which have been marked.*/
function createHeaders(exams, theme) {
    if(exams) {
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
        return null;
    }
}

/* Creates a row for each student appearing in grades. This is accomplished by 
iterating through grades and caling a helper function for each student. 
Students who have been registered, but not written any exams, will still be included.
Students who have not registered, but have written tests will also appear. */
function createRows(grades, theme, course, scanViewInfo, setScanViewInfo) {
    console.log(grades);
    if(grades) {
        let rows = [];
        for(let i = 0; i < grades.length; i++) {
            rows.push(createSingleRow(grades[i], theme, course, scanViewInfo, setScanViewInfo));
        }
        return rows;
    } else {
        //console.log("Error creating rows");
        return null;
    }
}

/*Creates a row for a single user. Each cell in the row is clickable and currently 
logs the userID, examId, and score for the cell clicked. This will later be modifed
to display a modal view containing the scan cooresponding to the cell, and allowing the 
instructor to edit the responses stored by the system.*/
function createSingleRow(studentGrades, theme, course, scanViewInfo, setScanViewInfo) {
    if(studentGrades) {
        const clickHandler = (userId, examId, studentScore, courseId) => {
            setScanViewInfo({
                isOpen: true,
                student: userId,
                exam: examId,
                score: studentScore,
                course: courseId,
            });
        }
        const onClose = () => {
            setScanViewInfo({
                isOpen: false,
                student: 0,
                exam: 0,
                score: 0,
                course: 0,
            });
        }

        const studentGradeList = studentGrades.scores.map(grade => {
            return( <>
                    <td
                        onClick = { () => clickHandler(studentGrades.userId, grade.examId, grade.studentScore, course)} 
                        className="p-4  hover:bg-black/10 cursor-pointer text-center">{grade.studentScore}
                    </td>
                </>);
        });
        
        let colours = "";
        if(theme === 'dark') {
            if (studentGrades.isRegistered) {
                colours = "bg-gray-700 text-white";
            } else {
                colours = "bg-[rgba(80,_50,_50,_1.0)] text-[white]";
            }
        } else {
            if (studentGrades.isRegistered) {
                colours = "bg-gray-200 text-black";
            } else {
                colours = "bg-[rgba(250,_150,_150,_1.0)] text-[black]";
            }
        }
        //Add border? border-[1px] border-[solid] border-[black]
        return (
            <tr key = {studentGrades.userId} className={`rounded-lg ${colours}`}>
                <td className="p-4">{String(studentGrades.userId).padStart(8,"0")}</td>
                <td className="p-4">{studentGrades.lastName}</td>
                <td className="p-4">{studentGrades.firstName}</td>
                {studentGradeList}
                <ScanView scanViewInfo = {scanViewInfo} onClose = {onClose}/>
            </tr>
        );
    } else {
        return null;
    }
}

export default StudentSpreadsheet;
