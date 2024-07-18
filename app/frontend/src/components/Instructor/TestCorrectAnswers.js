import React, {useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import EditBubble from '../BubbleSheet/EditableBubbles';

const CorrectAnswers = () => {
  const { courseId, testId } = useParams();
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const data = await fetch(`http://localhost/api/users/questions/answers/${testId}`);
      const results = await data.json();
      setQuestions(results);
      console.log(questions)
      console.log(results);
      setLoading(false);
    }
    fetchData();
  }, [testId]);

  if(loading) {
    return(
      <div>Loading</div>
    )
  } else {
    return(
      <div className="text-white">
        <table>
          <thead>
            <tr>
              <th>Question Number</th>
              <th>Correct Answer</th>
              <th>Weight</th>
            </tr>
          </thead>
          <tbody>
            {questions.map(question => (
              <tr key={question.id}>
                <td>{question.question_num}</td>
                <td><EditBubble question={question} /></td>
                <td>{question.weight}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }
}

export default CorrectAnswers;