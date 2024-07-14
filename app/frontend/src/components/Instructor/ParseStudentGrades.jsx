
function ParseStudentGrades(grades) {
    if(grades) {
        let exams = getExams(grades);
        let appendedGrades = [];
        appendedGrades.push(appendSingleGrade(grades, exams, 0));
        for(let i = 1; i < grades.length; i++) {
            if(grades[i].userId !== grades[i - 1].userId) {
                appendedGrades.push(appendSingleGrade(grades, exams, i))
            }
        }
        return {
            grades: appendedGrades,
            exams: exams,
        };
    } else {
        return null;
    }
}

function getExams(grades) {
    let distinctExams = [];
    const containsExamId = (examId, examArray) => {
        for(let i = 0; i < examArray.length; i++) {
            if(examId == examArray[i].examId) {
                return true;
            }
        }
        return false;
    }
    for(let i = 0; i < grades.length; i++) {
        let examInfo = {
            examId: grades[i].examId,
            examName: grades[i].examName,
        };
        if(examInfo.examId !== -1 && !containsExamId(examInfo.examId, distinctExams)) {
            distinctExams.push(examInfo)
        }
    };
    return distinctExams;
}

function appendSingleGrade(grades, exams, user) {
    let singleUserGrades = {
        userId: grades[user].userId,
        firstName: grades[user].firstName,
        lastName: grades[user].lastName,
        isRegistered: grades[user].isRegistered,
        scores: []
    }
    if(exams[0].examId) {
        if(grades[user].examId === -1) {
            for(let i = 0; i < exams.length; i++) {
                singleUserGrades.scores.push({
                    examId: exams[i].examId,
                    studentScore: 0
                });
            }
        } else {
            let examsIdx = 0;
            let newStudent = false;
            let userIdx = user;
            while(examsIdx < exams.length && !newStudent) {
                if(exams[examsIdx].examId === grades[userIdx].examId) {
                    singleUserGrades.scores.push({
                        examId: grades[userIdx].examId,
                        studentScore: grades[userIdx].studentScore
                    });
                userIdx++;
                examsIdx++;
                } else {
                    //if(grades[userIdx].examId === -1) {
                        //for(let i = 0; i < exams.length; i++) {
                            //singleUserGrades.scores.push(0);
                        //}
                    //} else {
                    singleUserGrades.scores.push({
                        examId: exams[examsIdx].examId,
                        studentScore: 0
                    });
                    examsIdx++;
                    //}
                }
                if(grades[userIdx]) {
                    newStudent = (grades[userIdx].userId !== grades[user].userId);
                } else {
                    break;
                }
            }
            for(examsIdx; examsIdx < exams.length; examsIdx++) {
                singleUserGrades.scores.push({
                    examId: exams[examsIdx].examId,
                    studentScore: 0
                });
            }
        }
    }
    return singleUserGrades;
}

export default ParseStudentGrades;
