const getRole = async () => {
    const token = localStorage.getItem("token");
  
    try {
      const response = await fetch(`http://localhost:80/api/auth/authenticate/${token}`);
  
      if (response.ok) {
        const user = await response.json();
        return user.role
      } else {
        return null;
      };
    } catch (error) {
      console.error("Error getting role:", error);
      return null;
    };
  };
  
  export default getRole;