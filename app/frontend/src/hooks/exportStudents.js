import { useEffect } from 'react';

const exportStudents = (data) => {
    useEffect(() => {
        const exportToCSV = () => {
            const csvContent = 'data:text/csv;charset=utf-8,';
            const headers = Object.keys(data[0]).join(',') + '\n';
            const rows = data.map((row) => Object.values(row).join(',') + '\n');
            const csvData = csvContent + headers + rows.join('');

            const encodedUri = encodeURI(csvData);
            const link = document.createElement('a');
            link.setAttribute('href', encodedUri);
            link.setAttribute('download', 'students.csv');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        };

        exportToCSV();
    }, [data]);
};

export default exportStudents;