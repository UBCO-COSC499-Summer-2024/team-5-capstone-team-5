import React, { useEffect, useState, useCallback } from 'react';
import getUserInfo from '../../hooks/getUserInfo';
import getAllUsers from '../../hooks/GetAllUsers';
import { useTheme } from '../../App';
import SearchBar from './AdminSearchBar'; // Ensure the path is correct
import changeUserRole from '../../hooks/changeUserRole';

const UserList = () => {

  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { theme } = useTheme();

  const fetchData = useCallback(async () => {
    const data = await getAllUsers();
    setUsers(data);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRoleChange = async (userId, newRole) => {
    console.log(`User ID: ${userId}, New Role: ${newRole}`);
    const success = await changeUserRole(userId, newRole);
    if (success) {
      setUsers(users.map(user => (user.id === userId ? { ...user, role: newRole } : user)));
      logChange(userId, users.find(user => user.id === userId).role, newRole);
    } else {
      console.error('Failed to update role');
    }
  };

  const logChange = (userId, oldRole, newRole) => {
    const changes = JSON.parse(localStorage.getItem('changes')) || [];
    const user = users.find(user => user.id === userId);
    const changeLog = {
      userId,
      firstName: user.first_name,
      lastName: user.last_name,
      oldRole,
      newRole,
      timestamp: new Date().toLocaleString()
    };
    changes.push(changeLog);
    localStorage.setItem('changes', JSON.stringify(changes));
  };

  

  const filteredUsers = users.filter(user =>
    user.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

return (
    <div className="p-4 flex flex-col min-h-screen">
      <SearchBar onSearch={setSearchQuery} />
      <div className="flex-grow mt-4">
        <table className="w-full text-left border-separate" style={{ borderSpacing: '0 10px' }}>
          <thead>
            <tr>
              <th className={`p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-300 text-black'}`}>User ID</th>
              <th className={`p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-300 text-black'}`}>Last Name</th>
              <th className={`p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-300 text-black'}`}>First Name</th>
              <th className={`p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-300 text-black'}`}>Email</th>
              <th className={`p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-300 text-black'}`}>Role</th>
              <th className={`p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-300 text-black'}`}>Change Role</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, index) => (
              <tr key={index} className={`rounded-lg ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'}`}>
                <td className="p-4">{String(user.id).padStart(8, "0")}</td>
                <td className="p-4">{user.last_name}</td>
                <td className="p-4">{user.first_name}</td>
                <td className="p-4">{user.email}</td>
                <td className="p-4">{user.role === 1 ? "Student" : user.role === 2 ? "Instructor" :user.role === 3 ? "Admin": ""}</td>
                <td className="p-4">
                  
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, parseInt(e.target.value))}
                    className={`p-2 rounded ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-300 text-black'}`}
                  >
                    <option value="1">Student</option>
                    <option value="2">Instructor</option>
                    <option value="3">Admin</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserList;
