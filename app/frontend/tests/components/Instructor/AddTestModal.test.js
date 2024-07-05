import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import AddTestModal from '../../../src/components/Instructor/AddTestModal';
import '@testing-library/jest-dom/extend-expect';
import { act } from 'react';

// Mock the useTheme hook
jest.mock('../../../src/App', () => ({
  useTheme: jest.fn(),
}));

const mockUseTheme = require('../../../src/App').useTheme;

const mockOnAddTest = jest.fn();
const mockOnClose = jest.fn();

// Mock the fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ id: 1, name: 'Midterm Exam', questions: [{ correctAnswer: [0, 2] }], courseId: 1 }),
  })
);

describe('AddTestModal Component', () => {
  beforeEach(() => {
    mockUseTheme.mockReturnValue({ theme: 'light' });
    mockOnAddTest.mockClear();
    mockOnClose.mockClear();
  });

  test('renders AddTestModal component when open', async () => {
    await act(async () => {
      render(<AddTestModal isOpen={true} onClose={mockOnClose} onAddTest={mockOnAddTest} courseId={1} />);
    });

    expect(screen.getByText(/Add New Test/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Exam Name/i)).toBeInTheDocument();
  });

  test('does not render AddTestModal component when closed', async () => {
    await act(async () => {
      render(<AddTestModal isOpen={false} onClose={mockOnClose} onAddTest={mockOnAddTest} courseId={1} />);
    });

    expect(screen.queryByText(/Add New Test/i)).not.toBeInTheDocument();
  });

  test('handles form interactions and saving the test', async () => {
    await act(async () => {
      render(<AddTestModal isOpen={true} onClose={mockOnClose} onAddTest={mockOnAddTest} courseId={1} />);
    });

    // Set exam name
    fireEvent.change(screen.getByLabelText(/Exam Name/i), { target: { value: 'Midterm Exam' } });

    // Add a question
    fireEvent.click(screen.getByText(/Add Question/i));
    expect(screen.getByText(/Question 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Number of Questions Added: 1/i)).toBeInTheDocument();

    // Get the question container and scope the queries within it
    const questionContainer = screen.getByText(/Question 1/i).closest('div.mb-4');

    // Simulate selecting answers
    const optionButtons = within(questionContainer).getAllByRole('button');
    fireEvent.click(optionButtons[0]); // A
    fireEvent.click(optionButtons[2]); // C

    // Save the test
    await act(async () => {
      fireEvent.click(screen.getByText(/Save Test/i));
    });

    expect(mockOnAddTest).toHaveBeenCalledWith(expect.objectContaining({
      name: 'Midterm Exam',
      questions: [
        { correctAnswer: [0, 2] } // 'A' maps to 0 and 'C' maps to 2
      ],
      courseId: 1,
    }));

    expect(mockOnClose).toHaveBeenCalled();
  });

  test('handles closing the modal', async () => {
    await act(async () => {
      render(<AddTestModal isOpen={true} onClose={mockOnClose} onAddTest={mockOnAddTest} courseId={1} />);
    });

    fireEvent.click(screen.getByText(/Cancel/i));

    expect(mockOnClose).toHaveBeenCalled();
  });
});
