import React, { useEffect, useState } from 'react';
import { useTheme } from '../../App'; // Adjust the path as needed

const SiteStatistics = () => {
  const [statistics, setStatistics] = useState([]);
  const [error, setError] = useState('');
  const { theme } = useTheme();

  const fetchStatistics = async () => {
    try {
      const response = await fetch('http://localhost:80/api/users/get/sitestatistics', {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Fetched data:', data);

      const statsArray = Object.keys(data).map(key => ({
        role: key,
        count: data[key]
      }));
      
      setStatistics(statsArray);
        console.log('Statistics state updated:', statsArray);
      } catch (error) {
        console.error('Error fetching statistics:', error);
      }
  };

  useEffect(() => {
    fetchStatistics();
  }, []);

  if (error) {
    return <div className="p-4 flex flex-col min-h-screen">Error: {error}</div>;
  }

  const roleNames = {
    1: 'Student',
    2: 'Instructor',
    3: 'Admin'
  };

  return (
    <div className="p-4 flex flex-col ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-black'} min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Site Statistics</h1>
      {statistics.length < 0 ? (
        <div>No statistics available.</div>
      ) : (
        <table className="w-full text-left border-separate" style={{ borderSpacing: '0 10px' }}>
          <thead>
            <tr>
              <th className="p-4 bg-gray-300 text-black">Role</th>
              <th className="p-4 bg-gray-300 text-black">Count</th>
            </tr>
          </thead>
          <tbody>
          {statistics.map((stat, index) => (
              <tr key={index} className="rounded-lg bg-gray-200 text-black">
                <td className="p-4">{roleNames[stat.role] || 'unknown'}</td>
                <td className="p-4">{stat.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SiteStatistics;
