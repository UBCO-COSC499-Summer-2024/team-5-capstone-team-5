const getCourseData = async (userId) => {
    try {
        console.log("Getting course data for user: ",userId)
      const response = await fetch(`http://localhost/api/users/courses/${userId}`);
      if(response.ok) {
        const courses = await response.json();
        console.log(courses);
        return courses;
      }
      else {
        console.error('POST Error',response.status, response.statusText);
        return;
      }
    } catch(error) {
      console.error('Failure fetching data: ',error);
      return;
    };
  };

  export default getCourseData;