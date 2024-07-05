// app/frontend/tests/components/Instructor/TestCorrectAnswers.test.js

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import TestCorrectAnswers from '../../../src/components/Instructor/TestCorrectAnswers';
import { useTheme } from '../../../src/App';

// Mock the useTheme hook
jest.mock('../../../src/App', () => ({
  useTheme: jest.fn(),
}));

// Mock the fetch API
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve([
      { question_num: 1, correct_answer: [0] },
      { question_num: 2, correct_answer: [1, 2] },
    ]),
  })
);

describe('TestCorrectAnswers Component', () => {
  const mockTest = { id: '123', name: 'Sample Test' };
  const mockOnBack = jest.fn();
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  beforeEach(() => {
    useTheme.mockReturnValue({ theme: 'light' });
  });

  it('renders without crashing and displays correct answers', async () => {
    render(<TestCorrectAnswers test={mockTest} onBack={mockOnBack} />);

    // Check if the back button is rendered
    expect(screen.getByText('Back')).toBeInTheDocument();

    // Check if the test name is rendered
    expect(screen.getByText('Sample Test - Correct Answers')).toBeInTheDocument();

    // Check if the correct answers are fetched and displayed
    await waitFor(() => {
      expect(screen.getByText('Question 1')).toBeInTheDocument();
      expect(screen.getByText(`Correct Answer(s): ${letters[0]}`)).toBeInTheDocument();

      expect(screen.getByText('Question 2')).toBeInTheDocument();
      expect(screen.getByText(`Correct Answer(s): ${letters[1]},${letters[2]}`)).toBeInTheDocument();
    });
  });

  it('handles back button click', () => {
    render(<TestCorrectAnswers test={mockTest} onBack={mockOnBack} />);

    // Click the back button
    fireEvent.click(screen.getByText('Back'));

    // Check if the onBack function was called
    expect(mockOnBack).toHaveBeenCalled();
  });
});
