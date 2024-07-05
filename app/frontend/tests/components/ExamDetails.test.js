// app/frontend/tests/components/ExamDetails.test.js

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom';
import ExamDetails from '../../../src/components/ExamDetails';
import getQuestions from '../../../src/hooks/getQuestions';

// Mock the useParams hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ examId: '456' }),
}));

// Mock the getQuestions hook
jest.mock('../../../src/hooks/getQuestions', () => jest.fn());

describe('ExamDetails Component', () => {
  const mockQuestionsData = [
    { id: 1, course_name: 'Math 101', exam_name: 'Midterm', question_num: 1, question: 'What is 2+2?', num_options: 4, weight: 1 },
    { id: 2, course_name: 'Math 101', exam_name: 'Midterm', question_num: 2, question: 'What is 3+3?', num_options: 4, weight: 1 },
  ];
  const mockProps = { id: '123' };

  beforeEach(() => {
    getQuestions.mockResolvedValue(mockQuestionsData);
  });

  it('renders without crashing and displays the loading state initially', () => {
    render(
      <BrowserRouter>
        <ExamDetails {...mockProps} />
      </BrowserRouter>
    );

    // Check if the loading text is rendered initially
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('fetches and displays questions data', async () => {
    render(
      <BrowserRouter>
        <ExamDetails {...mockProps} />
      </BrowserRouter>
    );

    // Wait for the questions data to be fetched and displayed
    await waitFor(() => {
      // Check if the exam and course name is rendered
      expect(screen.getByText('Math 101 Midterm')).toBeInTheDocument();

      // Check if the questions are rendered
      mockQuestionsData.forEach((question) => {
        expect(screen.getByText(question.question)).toBeInTheDocument();
      });
    });
  });
});
