// app/frontend/tests/components/Instructor/AddCourseModal.test.js

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import AddCourseModal from '../../../src/components/Instructor/AddCourseModal';
import { useTheme } from '../../../src/App';

jest.mock('../../../src/App', () => ({
  useTheme: jest.fn()
}));

describe('AddCourseModal', () => {
  const onAddCourse = jest.fn();
  const onClose = jest.fn();

  beforeEach(() => {
    useTheme.mockReturnValue({ theme: 'light' });
    jest.spyOn(window, 'alert').mockImplementation(() => {}); // Mock alert
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders AddCourseModal correctly when open', () => {
    render(<AddCourseModal isOpen={true} onClose={onClose} onAddCourse={onAddCourse} />);

    expect(screen.getByText('Add New Course')).toBeInTheDocument();
    expect(screen.getByLabelText('Department')).toBeInTheDocument();
    expect(screen.getByLabelText('Course Code')).toBeInTheDocument();
    expect(screen.getByLabelText('Course Section')).toBeInTheDocument();
    expect(screen.getByLabelText('Course Description')).toBeInTheDocument();
    expect(screen.getByLabelText('Start Date')).toBeInTheDocument();
    expect(screen.getByLabelText('End Date')).toBeInTheDocument();
  });

  test('does not render AddCourseModal when closed', () => {
    render(<AddCourseModal isOpen={false} onClose={onClose} onAddCourse={onAddCourse} />);

    expect(screen.queryByText('Add New Course')).not.toBeInTheDocument();
  });

  test('calls onClose when cancel button is clicked', () => {
    render(<AddCourseModal isOpen={true} onClose={onClose} onAddCourse={onAddCourse} />);

    fireEvent.click(screen.getByText('Cancel'));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('validates date fields before submission', async () => {
    render(<AddCourseModal isOpen={true} onClose={onClose} onAddCourse={onAddCourse} />);

    const startDateInput = screen.getByLabelText('Start Date');
    const endDateInput = screen.getByLabelText('End Date');
    const submitButton = screen.getByText('Add Course');

    // Set invalid start date (past date)
    fireEvent.change(startDateInput, { target: { value: '2023-01-01' } });
    fireEvent.change(endDateInput, { target: { value: '2023-01-02' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Start date cannot be before the current date.');
    });

    // Reset alert mock
    window.alert.mockClear();

    // Set end date before start date
    fireEvent.change(startDateInput, { target: { value: '2024-09-15' } });
    fireEvent.change(endDateInput, { target: { value: '2024-09-14' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('End date cannot be before the start date.');
    });

    // Reset alert mock
    window.alert.mockClear();

    // Set start date and end date to the same date
    fireEvent.change(endDateInput, { target: { value: '2024-09-15' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Start date and end date cannot be the same.');
    });
  });

  test('calls onAddCourse with correct data when form is submitted', async () => {
    render(<AddCourseModal isOpen={true} onClose={onClose} onAddCourse={onAddCourse} />);

    fireEvent.change(screen.getByLabelText('Department'), { target: { value: 'COMP' } });
    fireEvent.change(screen.getByLabelText('Course Code'), { target: { value: '100' } });
    fireEvent.change(screen.getByLabelText('Course Section'), { target: { value: '1' } });
    fireEvent.change(screen.getByLabelText('Course Description'), { target: { value: 'Introduction to Computer Science' } });
    fireEvent.change(screen.getByLabelText('Start Date'), { target: { value: '2024-09-15' } });
    fireEvent.change(screen.getByLabelText('End Date'), { target: { value: '2024-12-15' } });

    fireEvent.click(screen.getByText('Add Course'));

    await waitFor(() => {
      expect(onAddCourse).toHaveBeenCalledWith({
        courseDept: 'COMP',
        courseCode: '100',
        courseSection: '1',
        description: 'Introduction to Computer Science',
        startDate: '2024-09-15',
        endDate: '2024-12-15',
      });
    });

    expect(onClose).toHaveBeenCalled();
  });
});
