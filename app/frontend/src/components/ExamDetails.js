// src/components/ExamDetails.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getQuestions } from '../hooks/getQuestions';

const ExamDetails = () => {
  const { examId } = useParams();
  const [questions, setQuestions] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const data = await getQuestions(examId);
        setQuestions(data);
      } catch (error) {
        console.error('Error fetching questions:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [examId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!questions) {
    return <div>No Questions Available</div>;
  }

  return (
    <div>
      {questions.map((question, index) => (
        <div key={index}>
          <p>{question.question}</p>
        </div>
      ))}
    </div>
  );
};

export default ExamDetails;
