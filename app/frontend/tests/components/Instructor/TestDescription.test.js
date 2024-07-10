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

jest.mock('../../../src/components/Instructor/TestCorrectAnswers', () => {
  return ({ onBack }) => (
    <div>
      <h2>Correct Answers</h2>
      <button onClick={onBack}>Back to Description</button>
    </div>
  );
});

describe('TestDescription Component', () => {
  const mockTest = { id: 1, name: 'Sample Test', date_marked: '2023-01-01', mean_score: 75 };
  const mockOnBack = jest.fn();
  const mockOnDeleteTest = jest.fn();
  const mockOnEditTest = jest.fn();
  const mockToggleTheme = jest.fn();

  beforeEach(() => {
    useTheme.mockReturnValue({ theme: 'light', toggleTheme: mockToggleTheme });
  });

  it('renders without crashing and displays test details', () => {
    render(<TestDescription test={mockTest} onBack={mockOnBack} onDeleteTest={mockOnDeleteTest} onEditTest={mockOnEditTest} />);

    expect(screen.getByText('Back')).toBeInTheDocument();
    expect(screen.getByText('Sample Test')).toBeInTheDocument();
    expect(screen.getByText('Date Marked:')).toBeInTheDocument();
    expect(screen.getByText('2023-01-01')).toBeInTheDocument();
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

    expect(screen.getByText('File upload in progress!')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('File uploaded successfully!')).toBeInTheDocument();
    });

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

    expect(screen.getByText('File upload in progress!')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('File uploaded successfully!')).toBeInTheDocument();
    });

    expect(global.fetch).toHaveBeenCalledWith('http://localhost/api/users/tests/answers', expect.any(Object));
  });

  it('handles view correct answers', async () => {
    render(<TestDescription test={mockTest} onBack={mockOnBack} onDeleteTest={mockOnDeleteTest} onEditTest={mockOnEditTest} />);

    fireEvent.click(screen.getByText('Correct Answers'));

    await waitFor(() => {
      expect(screen.getByText('Correct Answers')).toBeInTheDocument();
    });
  });

  it('handles back button click', () => {
    render(<TestDescription test={mockTest} onBack={mockOnBack} onDeleteTest={mockOnDeleteTest} onEditTest={mockOnEditTest} />);

    fireEvent.click(screen.getByText('Back'));

    expect(mockOnBack).toHaveBeenCalled();
  });

  it('handles edit test name', async () => {
    const { container } = render(
      <TestDescription test={mockTest} onBack={mockOnBack} onDeleteTest={mockOnDeleteTest} onEditTest={mockOnEditTest} />
    );

    fireEvent.click(screen.getByText('Edit Test'));

    const input = screen.getByDisplayValue('Sample Test');
    fireEvent.change(input, { target: { value: 'New Test Name' } });

    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockOnEditTest).toHaveBeenCalledWith(mockTest.id, 'New Test Name');
    });

    console.log(container.innerHTML);

    await waitFor(() => {
      expect(screen.getByText('New Test Name')).toBeInTheDocument();
    });
  });

  it('handles delete test', () => {
    render(<TestDescription test={mockTest} onBack={mockOnBack} onDeleteTest={mockOnDeleteTest} onEditTest={mockOnEditTest} />);

    fireEvent.click(screen.getByText('Delete Test'));

    expect(mockOnDeleteTest).toHaveBeenCalledWith(mockTest.id);
  });
});
