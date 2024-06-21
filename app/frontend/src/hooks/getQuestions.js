const getQuestions = async (exam_id, user_id) => {
    try {
      const response = await fetch(`http://localhost/api/users/questions/${exam_id}&${user_id}`);
      if(response.ok) {
        const questions = await response.json();
        return questions;
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

  export default getQuestions;