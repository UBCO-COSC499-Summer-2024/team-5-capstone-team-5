// app/frontend/tests/components/Instructor/StudentList.test.js

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import StudentList from '../../../src/components/Instructor/StudentList';
import getStudentData from '../../../src/hooks/getStudentData';
import { useTheme } from '../../../src/App';

jest.mock('../../../src/hooks/getStudentData');
jest.mock('../../../src/App', () => ({
  useTheme: jest.fn(),
}));

const mockStudents = [
  { id: 1, first_name: 'John', last_name: 'Doe', role: 2 },
  { id: 2, first_name: 'Jane', last_name: 'Smith', role: 1 },
];

describe('StudentList Component', () => {
  beforeEach(() => {
    useTheme.mockReturnValue({ theme: 'light' });
    getStudentData.mockResolvedValue(mockStudents);
  });

  it('renders without crashing and displays students', async () => {
    render(<StudentList courseId="123" />);

    await waitFor(() => {
      // Check if the instructor is displayed
      expect(screen.getByText('Instructor: John Doe')).toBeInTheDocument();
    });

    // Check if the student is displayed by first and last name separately
    expect(screen.getByText('Smith')).toBeInTheDocument();
    expect(screen.getByText('Jane')).toBeInTheDocument();
  });

  it('handles file upload correctly', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      })
    );

    render(<StudentList courseId="123" />);

    const file = new File(['student data'], 'students.csv', { type: 'text/csv' });
    const input = screen.getByLabelText(/upload student data/i);

    fireEvent.change(input, { target: { files: [file] } });

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
