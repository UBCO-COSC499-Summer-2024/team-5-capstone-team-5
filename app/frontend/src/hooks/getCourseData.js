const getCourseData = async (userId) => {
  try {
    console.log("Getting course data for user: ", userId);
    const response = await fetch(`http://localhost:3000/api/users/courses/${userId}`);
    if (response.ok) {
      const text = await response.text();
      console.log('Response text:', text);  // Log the raw response text
      if (text) {
        const courses = JSON.parse(text);
        console.log('Parsed courses:', courses);  // Log the parsed JSON
        return courses;
      } else {
        console.error('Response body is empty');
        return [];
      }
    } else {
      console.error('POST Error', response.status, response.statusText);
      return [];
    }
  } catch (error) {
    console.error('Failure fetching data: ', error);
    return [];
  }
};

export default getCourseData;
