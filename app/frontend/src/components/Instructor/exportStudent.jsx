
import { saveAs } from 'file-saver';
import { parse } from 'json2csv';
import studentGrades from './ParseStudentGrades';

/**
 * Exports student grades to a CSV file.
 */
function exportStudentGrades() {
        // Convert student grades to CSV format
        const csvData = parse(studentGrades);
        // Create a new Blob object with the CSV data
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8' });
        // Save the file using FileSaver.js
        saveAs(blob, 'student_grades.csv');
    }
export default exportStudentGrades;