// tests/components/Instructor/StudentSpreadsheet.test.jsx

import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';
import StudentSpreadsheet from '../../../src/components/Instructor/StudentSpreadsheet';
import { useTheme } from '../../../src/App';
import validateUser from '../../../src/hooks/validateUser';
import getUserInfo from '../../../src/hooks/getUserInfo';
import getGrades from '../../../src/hooks/getGrades';
import ParseStudentGrades from '../../../src/components/Instructor/ParseStudentGrades';
import ScanView from '../../../src/components/Instructor/ScanView';

jest.mock('../../../src/App', () => ({
  useTheme: jest.fn(),
}));

jest.mock('../../../src/hooks/validateUser', () => jest.fn());
jest.mock('../../../src/hooks/getUserInfo', () => jest.fn());
jest.mock('../../../src/hooks/getGrades', () => jest.fn());
jest.mock('../../../src/components/Instructor/ParseStudentGrades', () => jest.fn());
jest.mock('../../../src/components/Instructor/ScanView', () => jest.fn(() => <div data-testid="ScanView"></div>));

describe('StudentSpreadsheet', () => {
  beforeEach(() => {
    useTheme.mockReturnValue({ theme: 'light', toggleTheme: jest.fn() });
    validateUser.mockReturnValue(Promise.resolve(true));
    getUserInfo.mockReturnValue(Promise.resolve({ name: 'John Doe', userId: 'user123' }));
    getGrades.mockReturnValue(Promise.resolve([
      { userId: 1, firstName: 'John', lastName: 'Doe', scores: [{ examId: 1, studentScore: 90, maxScore: 100, examName: 'Math' }] },
      { userId: 2, firstName: 'Jane', lastName: 'Smith', scores: [{ examId: 1, studentScore: 80, maxScore: 100, examName: 'Math' }] }
    ]));
    ParseStudentGrades.mockReturnValue({
      grades: [
        { userId: 1, firstName: 'John', lastName: 'Doe', scores: [{ examId: 1, studentScore: 90, maxScore: 100, examName: 'Math' }] },
        { userId: 2, firstName: 'Jane', lastName: 'Smith', scores: [{ examId: 1, studentScore: 80, maxScore: 100, examName: 'Math' }] }
      ],
      exams: [{ examId: 1, examName: 'Math' }]
    });
  });

  const renderComponent = (props) => {
    render(
      <Router>
        <StudentSpreadsheet {...props} />
      </Router>
    );
  };

  test('renders correctly when data is loaded', async () => {
    await act(async () => {
      renderComponent({ courseId: 'course123', courseName: 'Sample Course' });
    });

    await waitFor(() => {
      expect(screen.getAllByText(/John/).length).toBeGreaterThan(1); // Checks that there are multiple "John" texts
      expect(screen.getByText(/Instructor name: John Doe/)).toBeInTheDocument();
      expect(screen.getByText(/Instructor ID: user123/)).toBeInTheDocument();
      expect(screen.getByText(/Math/)).toBeInTheDocument();
    });
  });

  test('toggles percents', async () => {
    await act(async () => {
      renderComponent({ courseId: 'course123', courseName: 'Sample Course' });
    });

    await waitFor(() => {
      expect(screen.getByText(/Toggle percents/)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/Toggle percents/));

    expect(screen.getByText(/90/)).toBeInTheDocument(); // Assuming that the score is displayed as 90 when percents are toggled off
  });

  test('opens ScanView when a cell is clicked', async () => {
    await act(async () => {
      renderComponent({ courseId: 'course123', courseName: 'Sample Course' });
    });

    await waitFor(() => {
      expect(screen.getByText(/90%/)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/90%/));

    await waitFor(() => {
      expect(screen.getByTestId('ScanView')).toBeInTheDocument();
    });
  });
});
