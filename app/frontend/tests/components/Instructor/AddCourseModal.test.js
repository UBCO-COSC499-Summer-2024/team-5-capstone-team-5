// app/frontend/tests/components/Instructor/AddCourseModal.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AddCourseModal from '../../../src/components/Instructor/AddCourseModal';
import '@testing-library/jest-dom/extend-expect';
import { act } from 'react';

// Mock the useTheme hook
jest.mock('../../../src/App', () => ({
  useTheme: jest.fn(),
}));

const mockUseTheme = require('../../../src/App').useTheme;

const mockOnAddCourse = jest.fn();
const mockOnClose = jest.fn();

describe('AddCourseModal Component', () => {
  beforeEach(() => {
    mockUseTheme.mockReturnValue({ theme: 'light' });
    mockOnAddCourse.mockClear();
    mockOnClose.mockClear();
  });

  test('renders AddCourseModal component when open', async () => {
    await act(async () => {
      render(<AddCourseModal isOpen={true} onClose={mockOnClose} onAddCourse={mockOnAddCourse} />);
    });

    expect(screen.getByText(/Add New Course/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Department/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Course Code/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Course Section/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Course Description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Start Date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/End Date/i)).toBeInTheDocument();
  });

  test('does not render AddCourseModal component when closed', async () => {
    await act(async () => {
      render(<AddCourseModal isOpen={false} onClose={mockOnClose} onAddCourse={mockOnAddCourse} />);
    });

    expect(screen.queryByText(/Add New Course/i)).not.toBeInTheDocument();
  });

  test('handles form submission', async () => {
    await act(async () => {
      render(<AddCourseModal isOpen={true} onClose={mockOnClose} onAddCourse={mockOnAddCourse} />);
    });

    fireEvent.change(screen.getByLabelText(/Department/i), { target: { value: 'COMP' } });
    fireEvent.change(screen.getByLabelText(/Course Code/i), { target: { value: '100' } });
    fireEvent.change(screen.getByLabelText(/Course Section/i), { target: { value: '001' } });
    fireEvent.change(screen.getByLabelText(/Course Description/i), { target: { value: 'Introduction to Computer Science' } });
    fireEvent.change(screen.getByLabelText(/Start Date/i), { target: { value: '2023-09-01' } });
    fireEvent.change(screen.getByLabelText(/End Date/i), { target: { value: '2023-12-15' } });

    fireEvent.submit(screen.getByRole('button', { name: /Add Course/i }));

    expect(mockOnAddCourse).toHaveBeenCalledWith({
      courseDept: 'COMP',
      courseCode: '100',
      courseSection: '001',
      description: 'Introduction to Computer Science',
      startDate: '2023-09-01',
      endDate: '2023-12-15',
    });

    expect(mockOnClose).toHaveBeenCalled();
  });

  test('handles closing the modal', async () => {
    await act(async () => {
      render(<AddCourseModal isOpen={true} onClose={mockOnClose} onAddCourse={mockOnAddCourse} />);
    });

    fireEvent.click(screen.getByRole('button', { name: /Cancel/i }));

    expect(mockOnClose).toHaveBeenCalled();
  });
});
