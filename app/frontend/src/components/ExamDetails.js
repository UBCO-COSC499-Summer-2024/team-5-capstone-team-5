// app/frontend/src/components/ExamDetails.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ExamModule from './Modules/ExamModule';

const fetchQuestions = async (examId) => {
  // Mock implementation or actual fetch logic
  return [
    { id: 1, question_num: 1, num_options: 4, weight: 2, correct_answer: ['A', 'B'], response: ['A', 'B'] },
    { id: 2, question_num: 2, num_options: 4, weight: 1, correct_answer: ['A'], response: ['A'] },
  ];
};

const ExamDetails = () => {
  const { examId } = useParams();
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchQuestions(examId);
        setQuestions(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching questions:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [examId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {questions.length > 0 ? (
        questions.map((question) => (
          <ExamModule key={question.id} question={question} />
        ))
      ) : (
        <div>No questions available</div>
      )}
    </div>
  );
};

export default ExamDetails;
export { fetchQuestions };  