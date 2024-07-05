// app/frontend/tests/components/Instructor/TestDescription.test.js

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import TestDescription from '../../../src/components/Instructor/TestDescription';
import { useTheme } from '../../../src/App';

// Mock the useTheme hook
jest.mock('../../../src/App', () => ({
  useTheme: jest.fn(),
}));

describe('TestDescription Component', () => {
  const mockTest = { id: '123', name: 'Sample Test', date_marked: '2023-01-01', mean_score: 75 };
  const mockOnBack = jest.fn();
  const mockOnDeleteTest = jest.fn();
  const mockOnEditTest = jest.fn();
  const mockToggleTheme = jest.fn();

  beforeEach(() => {
    useTheme.mockReturnValue({ theme: 'light', toggleTheme: mockToggleTheme });
  });

  it('renders without crashing and displays test details', () => {
    render(<TestDescription test={mockTest} onBack={mockOnBack} onDeleteTest={mockOnDeleteTest} onEditTest={mockOnEditTest} />);

    // Check if the back button is rendered
    expect(screen.getByText('Back')).toBeInTheDocument();

    // Check if the test name is rendered
    expect(screen.getByText('Sample Test')).toBeInTheDocument();

    // Check if the date marked is rendered
    expect(screen.getByText('Date Marked:')).toBeInTheDocument();
    expect(screen.getByText('2023-01-01')).toBeInTheDocument();

    // Check if the mean score is rendered
    expect(screen.getByText('Mean Score:')).toBeInTheDocument();
    expect(screen.getByText('75')).toBeInTheDocument();
  });

  it('handles file upload correctly', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      })
    );

    render(<TestDescription test={mockTest} onBack={mockOnBack} onDeleteTest={mockOnDeleteTest} onEditTest={mockOnEditTest} />);

    const file = new File(['student data'], 'students.pdf', { type: 'application/pdf' });
    const input = screen.getByLabelText(/upload student tests/i);

    fireEvent.change(input, { target: { files: [file] } });

    // Check if the uploading message is displayed
    expect(screen.getByText('File upload in progress!')).toBeInTheDocument();

    // Wait for the file upload to complete
    await waitFor(() => {
      expect(screen.getByText('File uploaded successfully!')).toBeInTheDocument();
    });

    // Check if the fetch function was called with the correct parameters
    expect(global.fetch).toHaveBeenCalledWith('http://localhost/api/users/tests/upload', expect.any(Object));
  });

  it('handles answer key upload correctly', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      })
    );

    render(<TestDescription test={mockTest} onBack={mockOnBack} onDeleteTest={mockOnDeleteTest} onEditTest={mockOnEditTest} />);

    const file = new File(['answer key data'], 'answerkey.pdf', { type: 'application/pdf' });
    const input = screen.getByLabelText(/upload answer key/i);

    fireEvent.change(input, { target: { files: [file] } });

    // Check if the uploading message is displayed
    expect(screen.getByText('File upload in progress!')).toBeInTheDocument();

    // Wait for the file upload to complete
    await waitFor(() => {
      expect(screen.getByText('File uploaded successfully!')).toBeInTheDocument();
    });

    // Check if the fetch function was called with the correct parameters
    expect(global.fetch).toHaveBeenCalledWith('http://localhost/api/users/tests/answers', expect.any(Object));
  });

  it('handles view correct answers', () => {
    render(<TestDescription test={mockTest} onBack={mockOnBack} onDeleteTest={mockOnDeleteTest} onEditTest={mockOnEditTest} />);

    // Click the correct answers button
    fireEvent.click(screen.getByText('Correct Answers'));

    // Check if the TestCorrectAnswers component is rendered
    expect(screen.getByText('Correct Answers')).toBeInTheDocument();
  });

  it('handles back button click', () => {
    render(<TestDescription test={mockTest} onBack={mockOnBack} onDeleteTest={mockOnDeleteTest} onEditTest={mockOnEditTest} />);

    // Click the back button
    fireEvent.click(screen.getByText('Back'));

    // Check if the onBack function was called
    expect(mockOnBack).toHaveBeenCalled();
  });

  it('handles edit test name', async () => {
    render(<TestDescription test={mockTest} onBack={mockOnBack} onDeleteTest={mockOnDeleteTest} onEditTest={mockOnEditTest} />);

    // Click the edit button
    fireEvent.click(screen.getByText('Edit Test'));

    // Change the test name
    fireEvent.change(screen.getByDisplayValue('Sample Test'), { target: { value: 'New Test Name' } });

    // Click the save button
    fireEvent.click(screen.getByText('Save'));

    // Wait for the edit to complete
    await waitFor(() => {
      expect(mockOnEditTest).toHaveBeenCalledWith(mockTest.id, 'New Test Name');
    });

    // Check if the test name is updated
    expect(screen.getByText('New Test Name')).toBeInTheDocument();
  });

  it('handles delete test', () => {
    render(<TestDescription test={mockTest} onBack={mockOnBack} onDeleteTest={mockOnDeleteTest} onEditTest={mockOnEditTest} />);

    // Click the delete button
    fireEvent.click(screen.getByText('Delete Test'));

    // Check if the onDeleteTest function was called
    expect(mockOnDeleteTest).toHaveBeenCalledWith(mockTest.id);
  });
});
