const getTestData = async (course_id) => {
    try {
      const response = await fetch(`http://localhost/api/users/exams/${course_id}`);
      if(response.ok) {
        const tests = await response.json();
        console.log(tests);
        return tests;
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

  export default getTestData;