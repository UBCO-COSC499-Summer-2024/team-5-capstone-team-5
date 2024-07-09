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
    }, [navigate, props.courseId]);

    const oldTable = (
        <table className="w-full text-left border-separate" style={{ borderSpacing: '0 10px' }}>
        <thead>
            <tr>
                <th className={`p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-300 text-black'}`}>Student ID</th>
                <th className={`p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-300 text-black'}`}>Last Name</th>
                <th className={`p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-300 text-black'}`}>First Name</th>
                <th className={`p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-300 text-black'}`}>Role</th>
            </tr>
        </thead>
        <tbody>
            {props.students.map((student, index) => (
                <tr key={index} className={`rounded-lg ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'}`}>
                    <td className="p-4">{String(student.id).padStart(8,"0")}</td>
                    <td className="p-4">{student.last_name}</td>
                    <td className="p-4">{student.first_name}</td>
                    <td className="p-4">{student.role === 1 ? "Student" : "Instructor"}</td>
                </tr>
            ))}
        </tbody>
        </table>
    );

    return (<>

    <table>
        <thead>
            {createHeaderRow(grades, theme)}
        </thead>
        <tbody>
            {createRows(grades, theme)}
        </tbody>

    </table>
    <p>Course ID: {props.courseId}</p>
    <p>Instructor name: {userInfo.name}</p>
    <p>Instructor ID: {userInfo.id}</p>
    </>);
}

const getGrades = async (courseId) => {
    const response = await fetch(`http://localhost/api/users/courses/grades/${courseId}`);
    if(response.ok) {
        const grades = await response.json();
        return grades;
    } else {
        console.log("Error retrieving grades");
        return null;
    }
};

function createHeaderRow(courseGrades, theme) {
    if(courseGrades) {
        const distinctExams = getColumns(courseGrades);
        //distinctExams.sort((a, b) => {return (a.examId-b.examId);});
        const examColumns = distinctExams.map(exam => {
            return(<th key = {exam.examId} className={`p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-300 text-black'}`}>{exam.examName}</th>);
        });

        return (
            <tr>
                <th className={`p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-300 text-black'}`}>Student ID</th>
                <th className={`p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-300 text-black'}`}>Last Name</th>
                <th className={`p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-300 text-black'}`}>First Name</th>
                {examColumns}
            </tr>
        );
    } else {
        return null;
    }
}

function createRows(courseGrades = [], theme) {
    console.log("Course Grades:",courseGrades)
    if(courseGrades) {
        if(courseGrades.length > 0) {
            let rows = [];
            let startIndex = 0, endIndex = 0;
            const len = courseGrades.length

            while(endIndex < len) {
                while(courseGrades[startIndex].user_id == courseGrades[endIndex].user_id) {
                    endIndex++;
                    if(endIndex == len) {
                        break;
                    }
                }
                    rows.push(createSingleRow(courseGrades, theme, startIndex, endIndex - 1));
                    startIndex = endIndex;
                    endIndex++;
            }
            if(courseGrades[len - 1].user_id != courseGrades[len - 2].user_id) {
                rows.push(createSingleRow(courseGrades, theme, len - 1, len - 1));
            }
            return rows;
        } else {
            return null;
        }
    }
}

function createSingleRow(courseGrades, theme, startIndex, endIndex) {
    if(courseGrades) {
        let studentGrades = [];
        for(let i = startIndex; i <= endIndex; i++) {
            studentGrades.push({
                examId: courseGrades[i].exam_id,
                studentScore: courseGrades[i].student_score,
            });
        }
        const studentGradeList = studentGrades.map(grade => {
            return( <td key = {grade.examId} className="p-4">{grade.studentScore}</td>);
        });

        return (
            <tr className={`rounded-lg ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'}`}>
                <td className="p-4">{String(courseGrades[startIndex].user_id).padStart(8,"0")}</td>
                <td className="p-4">{courseGrades[startIndex].last_name}</td>
                <td className="p-4">{courseGrades[startIndex].first_name}</td>
                {studentGradeList}
            </tr>
        );
    } else {
        return null;
    }
}

function getColumns(courseGrades) {
    let distinctExams = [];
    const containsExamId = (examId, examArray) => {
        for(let i = 0; i < examArray.length; i++) {
            if(examId == examArray[i].examId) {
                return true;
            }
        }
        return false;
    }
    for(let i = 0; i < courseGrades.length; i++) {
        let examInfo = {
            examId: courseGrades[i].exam_id,
            examName: courseGrades[i].exam_name,
        };
        if(!containsExamId(examInfo.examId, distinctExams)) {
            distinctExams.push(examInfo)
        }
    };
    return distinctExams;
}

export default StudentSpreadsheet;
