// app/frontend/src/hooks/changeUserRole.js

const changeUserRole = async (userId, newRole) => {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const response = await fetch(`http://localhost:80/api/users/changerole/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ role: newRole })
      });
      if (response.ok) {
        const result = await response.json();
        console.log('Role update result:', result);
        return { success: true };
      } else {
        const errorMessage = await response.text();
        console.error('Failed to update role:', errorMessage);
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      console.error("Error updating user role:", error);
      return { success: false, error: error.message };
    }
  } else {
    console.error('No token found');
    return { success: false, error: 'No token found' };
  }
};

export default changeUserRole;
