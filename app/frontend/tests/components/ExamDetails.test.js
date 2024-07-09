// tests/components/ExamDetails.test.js
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ExamDetails from '../../src/components/ExamDetails';
import { getQuestions } from '../../src/hooks/getQuestions';

jest.mock('../../src/hooks/getQuestions', () => ({
  getQuestions: jest.fn(),
}));

describe('ExamDetails Component', () => {
  beforeEach(() => {
    getQuestions.mockClear();
  });

  it('renders loading state initially', () => {
    render(
      <BrowserRouter>
        <Routes>
          <Route path="/exam/:examId" element={<ExamDetails />} />
        </Routes>
      </BrowserRouter>
    );

    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it('renders exam details after loading', async () => {
    getQuestions.mockResolvedValueOnce([
      { question: 'Question 1?' },
      { question: 'Question 2?' },
    ]);

    render(
      <BrowserRouter>
        <Routes>
          <Route path="/exam/:examId" element={<ExamDetails />} />
        </Routes>
      </BrowserRouter>
    );

    await waitFor(() => expect(getQuestions).toHaveBeenCalledWith('1'));

    expect(screen.getByText('Question 1?')).toBeInTheDocument();
    expect(screen.getByText('Question 2?')).toBeInTheDocument();
  });

  it('calls getQuestions with correct parameters', async () => {
    getQuestions.mockResolvedValueOnce([]);

    render(
      <BrowserRouter>
        <Routes>
          <Route path="/exam/:examId" element={<ExamDetails />} />
        </Routes>
      </BrowserRouter>
    );

    await waitFor(() => expect(getQuestions).toHaveBeenCalledWith('1'));
  });
});
