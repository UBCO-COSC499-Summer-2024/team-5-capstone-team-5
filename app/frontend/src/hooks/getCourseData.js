const getCourseData = async (userId) => {
  try {
    const response = await fetch(`http://localhost/api/courses/user/${userId}`);
    if (response.ok) {
      const courses = await response.json();
      return courses;
    } else {
      console.error('GET Error', response.status, response.statusText);
      return;
    }
  } catch (error) {
    console.error('Failure fetching data: ', error);
    return;
  }
};

export default getCourseData;
