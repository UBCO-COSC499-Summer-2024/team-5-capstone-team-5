import React from 'react';
import Bubble from '../BubbleSheet/Bubbles';

const ExamModule = ({ question, id }) => {
  const compareAnswers = (correct_answer, responses, weight) => {
    if (correct_answer.length !== responses.length) {
      throw new Error('Arrays must be the same length (answers and responses)');
    }
    let count = 0;
    for (let i = 0; i < correct_answer.length; i++) {
      if (correct_answer[i] === responses[i]) {
        count += 1 / weight;
      }
    }
    return count;
  };

  return (
    <li className="bg-gray-700 m-4 p-2 rounded-lg">
      <h2>Question: {question.question_num}</h2>
      <h2>Number of options: {question.num_options}</h2>
      <h2>Weight: {question.weight}</h2>
      <h2>Correct answers:</h2>
      <Bubble question={question} />
      <h2>
        Grade:{' '}
        {compareAnswers(question.correct_answer, question.response, question.weight) *
          question.weight}
      </h2>
    </li>
  );
};

export default ExamModule;
