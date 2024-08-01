import React from "react";
import { useTheme } from '../../App';
import { fiveNumSummary, mean, stdev, } from "../Instructor/stats.jsx";

const InstructorTest = ({ setState, test, parsedGrades, asPercents }) => {
    const { theme } = useTheme();
    let examGrades = [];
    for(let i = 0; i < parsedGrades.grades.length; i ++) {
      for(let j = 0; j < parsedGrades.grades[i].scores.length; j++)
        if(parsedGrades.grades[i].scores[j].examId === test.id) {
          if(!asPercents) {
            examGrades.push(parsedGrades.grades[i].scores[j].studentScore/1.0);
          } else {
            examGrades.push(100*parsedGrades.grades[i].scores[j].studentScore/parsedGrades.grades[i].scores[j].maxScore);
          }
          break;
        }
    }
    const examMean = examGrades.length > 0 ? mean(examGrades).toFixed(3) : '-';
    const examStdev = examGrades.length > 0 ? stdev(examGrades).toFixed(3) : '-';
    const [min, Q1, median, Q3, max] = examGrades.length > 0 ? fiveNumSummary(examGrades) : ['-', '-', '-', '-', '-'];
    return(
        <tr
          className={`cursor-pointer ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-300 text-black'}`}
          onClick={() => setState(test)}
        >
          <td className="p-4">{test.name.length < 32 ? test.name : test.name.substring(0, 29) + "..."}</td>
          <td className="p-4 text-center">{examMean}{asPercents&&examGrades.length > 0 ? '%' :''}</td>
          <td className="p-4 text-center">{examStdev}{asPercents&&examGrades.length > 0 ? '%' :''}</td>
          <td className="p-4 text-center">{min}{asPercents&&examGrades.length > 0 ? '%' :''}</td>
          <td className="p-4 text-center">{Q1}{asPercents&&examGrades.length > 0 ? '%' :''}</td>
          <td className="p-4 text-center">{median}{asPercents&&examGrades.length > 0 ? '%' :''}</td>
          <td className="p-4 text-center">{Q3}{asPercents&&examGrades.length > 0 ? '%' :''}</td>
          <td className="p-4 text-center">{max}{asPercents&&examGrades.length > 0 ? '%' :''}</td>
        </tr>
    )
}

export default InstructorTest;