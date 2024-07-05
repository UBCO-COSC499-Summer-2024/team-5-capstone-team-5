// app/frontend/tests/modules/ExamModule.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import Exam from '../../src/components/Modules/ExamModule';
import '@testing-library/jest-dom/extend-expect';

// Mock the Bubble component
jest.mock('../../src/components/BubbleSheet/Bubbles', () => () => <div>Mocked Bubble Component</div>);

const question = {
  question_num: 1,
  num_options: 4,
  weight: 2,
  correct_answer: ['A', 'B'],
  response: ['A', 'B'],
};

test('renders Exam component with correct question details', () => {
  render(<Exam question={question} key="test-key" />);

  // Check if the question details are rendered correctly
  expect(screen.getByText(/Question: 1/i)).toBeInTheDocument();
  expect(screen.getByText(/Number of options: 4/i)).toBeInTheDocument();
  expect(screen.getByText(/Weight: 2/i)).toBeInTheDocument();
  expect(screen.getByText(/Mocked Bubble Component/i)).toBeInTheDocument();
  expect(screen.getByText(/Grade: 2/i)).toBeInTheDocument(); // Assuming the weight is correctly applied
});

test('compares answers correctly', () => {
  const { container } = render(<Exam question={question} key="test-key" />);

  // Verify the output of the compareAnswers function within the component
  const gradeElement = container.querySelector('h2:nth-child(6)');
  expect(gradeElement).toHaveTextContent('Grade: 2');
});
