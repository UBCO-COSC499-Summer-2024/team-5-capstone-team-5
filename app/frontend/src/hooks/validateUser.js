const validateUser = async () => {
    const token = await localStorage.getItem("token");
    console.log("token: ",token);
  
    try {
      const response = await fetch(`http://localhost:80/api/auth/authenticate/${token}`);
  
      if (response.ok) {
        const user = await response.json();
        return user ? true : false;
      } else {
        return false;
      };
    } catch (error) {
      console.error("Error during user validation:", error);
      return false;
    };
  };
  
  export default validateUser;