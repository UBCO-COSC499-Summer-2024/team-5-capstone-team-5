// app/frontend/tests/components/ExamDetails.test.js
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ExamDetails, { fetchQuestions } from '../../src/components/ExamDetails';
import '@testing-library/jest-dom/extend-expect';

jest.mock('../../src/components/ExamDetails', () => ({
  ...jest.requireActual('../../src/components/ExamDetails'),
  fetchQuestions: jest.fn(),
}));

const mockQuestions = [
  { id: 1, question_num: 1, num_options: 4, weight: 2, correct_answer: ['A', 'B'], response: ['A', 'B'] },
  { id: 2, question_num: 2, num_options: 4, weight: 1, correct_answer: ['A'], response: ['A'] },
];

test('renders ExamDetails component with questions', async () => {
  fetchQuestions.mockResolvedValueOnce(mockQuestions);

  render(
    <BrowserRouter initialEntries={['/exam/1']}>
      <Routes>
        <Route path="/exam/:examId" element={<ExamDetails />} />
      </Routes>
    </BrowserRouter>
  );

  expect(screen.getByText(/Loading/i)).toBeInTheDocument();

  await waitFor(() => expect(fetchQuestions).toHaveBeenCalledWith('1'));

  expect(screen.getByText(/Question: 1/i)).toBeInTheDocument();
  expect(screen.getByText(/Question: 2/i)).toBeInTheDocument();
});

test('renders ExamDetails component with no questions', async () => {
  fetchQuestions.mockResolvedValueOnce([]);

  render(
    <BrowserRouter initialEntries={['/exam/1']}>
      <Routes>
        <Route path="/exam/:examId" element={<ExamDetails />} />
      </Routes>
    </BrowserRouter>
  );

  expect(screen.getByText(/Loading/i)).toBeInTheDocument();

  await waitFor(() => expect(fetchQuestions).toHaveBeenCalledWith('1'));

  expect(screen.getByText(/No questions available/i)).toBeInTheDocument();
});
