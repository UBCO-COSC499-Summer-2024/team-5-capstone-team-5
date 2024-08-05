// app/frontend/tests/components/Instructor/StudentSpreadsheet.test.jsx

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect'; // Ensure toBeInTheDocument is imported
import StudentSpreadsheet from '@components/Instructor/StudentSpreadsheet';
import { useTheme } from '@src/App';
import validateUser from '@src/hooks/validateUser';
import getUserInfo from '@src/hooks/getUserInfo';
import getGrades from '@src/hooks/getGrades';

// Mocking dependencies
jest.mock('@src/App', () => ({
  useTheme: jest.fn(),
}));

jest.mock('@src/hooks/validateUser', () => jest.fn());
jest.mock('@src/hooks/getUserInfo', () => jest.fn());
jest.mock('@src/hooks/getGrades', () => jest.fn());

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve([]),
  })
);

describe('StudentSpreadsheet Component', () => {
  beforeEach(() => {
    useTheme.mockReturnValue({ theme: 'light' });
    validateUser.mockResolvedValue(true);
    getUserInfo.mockResolvedValue({ name: 'Instructor Name', userId: 1 });
    getGrades.mockResolvedValue([
      {
        userId: 1,
        firstName: 'John',
        lastName: 'Doe',
        scores: [
          { examId: 1, studentScore: 80, maxScore: 100, examName: 'Exam 1' },
          { examId: 2, studentScore: 90, maxScore: 100, examName: 'Exam 2' },
        ],
        isRegistered: true,
      },
    ]);
  });

  test('renders the component and displays initial loading state', async () => {
    render(
      <Router>
        <StudentSpreadsheet courseName="Math" courseId={1} />
      </Router>
    );

    expect(await screen.findByText('Instructor name: Instructor Name')).toBeInTheDocument();
    expect(await screen.findByText('John')).toBeInTheDocument();
    expect(await screen.findByText('Doe')).toBeInTheDocument();
  });

  test('toggles between raw scores and percentages', async () => {
    render(
      <Router>
        <StudentSpreadsheet courseName="Math" courseId={1} />
      </Router>
    );

    const toggleButton = await screen.findByText(/toggle percents/i);
    expect(toggleButton).toBeInTheDocument();

    fireEvent.click(toggleButton);
    expect(await screen.findByText('80%')).toBeInTheDocument();
    expect(await screen.findByText('90%')).toBeInTheDocument();

    fireEvent.click(toggleButton);
    expect(await screen.findByText('80')).toBeInTheDocument();
    expect(await screen.findByText('90')).toBeInTheDocument();
  });

  test('displays the user info and course info', async () => {
    render(
      <Router>
        <StudentSpreadsheet courseName="Math" courseId={1} />
      </Router>
    );

    expect(await screen.findByText('Course ID: 1')).toBeInTheDocument();
    expect(await screen.findByText('Instructor name: Instructor Name')).toBeInTheDocument();
    expect(await screen.findByText('Instructor ID: 1')).toBeInTheDocument();
  });
});
