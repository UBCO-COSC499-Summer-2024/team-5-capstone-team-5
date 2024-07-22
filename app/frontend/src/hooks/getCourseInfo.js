const getCourseInfo = async (courseId) => {
    try {
        const response = await fetch(`http://localhost/api/users/courses/info/${courseId}`);
        if(response.ok) {
        const courseInfo = await response.json();
        return courseInfo;
        }
    } catch(error) {
        console.error('Failure fetching data: ',error);
        return;
    }
}

export default getCourseInfo;