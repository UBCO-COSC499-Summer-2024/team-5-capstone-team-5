// app/frontend/tests/components/Instructor/StudentList.test.js

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import StudentList from '../../../src/components/Instructor/StudentList';
import { useTheme } from '../../../src/App';
import getStudentData from '../../../src/hooks/getStudentData';

// Mock the useTheme hook
jest.mock('../../../src/App', () => ({
  useTheme: jest.fn(),
}));

// Mock the getStudentData hook
jest.mock('../../../src/hooks/getStudentData', () => jest.fn());

describe('StudentList Component', () => {
  const mockStudents = [
    { id: 1, first_name: 'John', last_name: 'Doe', role: 2 },
    { id: 2, first_name: 'Jane', last_name: 'Smith', role: 1 },
    { id: 3, first_name: 'Alice', last_name: 'Johnson', role: 1 },
  ];
  const mockCourseId = '123';
  const mockFetch = jest.fn();

  beforeEach(() => {
    useTheme.mockReturnValue({ theme: 'light' });
    getStudentData.mockResolvedValue(mockStudents);
  });

  it('renders without crashing and displays student data', async () => {
    render(<StudentList courseId={mockCourseId} />);

    // Check if the instructor is rendered
    await waitFor(() => {
      expect(screen.getByText('Instructor: John Doe')).toBeInTheDocument();
    });

    // Check if the student data is rendered
    mockStudents.forEach((student) => {
      expect(screen.getByText(student.first_name)).toBeInTheDocument();
      expect(screen.getByText(student.last_name)).toBeInTheDocument();
    });
  });

  it('handles file upload correctly', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      })
    );

    render(<StudentList courseId={mockCourseId} />);

    const file = new File(['student data'], 'students.csv', { type: 'text/csv' });
    const input = screen.getByLabelText(/upload student data/i);

    await waitFor(() => {
      fireEvent.change(input, { target: { files: [file] } });
    });

    // Check if the uploading message is displayed
    expect(screen.getByText('Uploading File')).toBeInTheDocument();

    // Wait for the file upload to complete
    await waitFor(() => {
      expect(screen.getByText('File Uploaded!')).toBeInTheDocument();
    });

    // Check if the fetch function was called with the correct parameters
    expect(global.fetch).toHaveBeenCalledWith('http://localhost/api/users/students/upload', expect.any(Object));
  });
});
