// tests/components/Instructor/NotificationBell.test.js

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import NotificationBell from '../../../src/components/Instructor/NotificationBell';
import { useTheme } from '../../../src/App';

jest.mock('../../../src/App', () => ({
  useTheme: jest.fn(),
}));

const mockFetchNotifications = jest.fn();

const notifications = [
  {
    id: 1,
    course_dept: 'CS',
    course_code: '101',
    course_section: '01',
    exam_name: 'Midterm',
    question_num: 3,
    user_id: '12345',
    issue: 'Clarification needed'
  },
  {
    id: 2,
    course_dept: 'MATH',
    course_code: '202',
    course_section: '02',
    exam_name: 'Final',
    question_num: 5,
    user_id: '67890',
    issue: 'Typo in question'
  }
];

describe('NotificationBell', () => {
  beforeEach(() => {
    useTheme.mockReturnValue({ theme: 'light' });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = (props = {}) => {
    render(
      <NotificationBell
        userId="test-user-id"
        notifications={notifications}
        fetchNotifications={mockFetchNotifications}
        {...props}
      />
    );
  };

  test('renders bell icon with notifications indicator', () => {
    renderComponent();

    expect(screen.getByRole('img', { hidden: true })).toBeInTheDocument();
  });

  test('filters notifications based on search input', async () => {
    renderComponent();

    fireEvent.click(screen.getByRole('img', { hidden: true }));

    await waitFor(() => {
      expect(screen.getByText(/Notifications/i)).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText(/Search by Question \/ Student ID/i), {
      target: { value: '12345' }
    });

    expect(screen.getByText(/Clarification needed/i)).toBeInTheDocument();
    expect(screen.queryByText(/Typo in question/i)).not.toBeInTheDocument();
  });

  test('resolves a notification', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({}),
      })
    );

    renderComponent();

    fireEvent.click(screen.getByRole('img', { hidden: true }));

    await waitFor(() => {
      expect(screen.getByText(/Notifications/i)).toBeInTheDocument();
    });

    const resolveButtons = screen.getAllByText(/Mark as resolved/i);
    fireEvent.click(resolveButtons[0]);

    await waitFor(() => {
      expect(mockFetchNotifications).toHaveBeenCalled();
    });
  });

  test('applies correct class names based on theme', () => {
    useTheme.mockReturnValue({ theme: 'dark' });

    renderComponent();

    expect(screen.getByRole('img', { hidden: true })).toHaveClass('text-white');
    fireEvent.click(screen.getByRole('img', { hidden: true }));

    expect(screen.getByPlaceholderText(/Search by Question \/ Student ID/i)).toHaveClass('bg-gray-800 text-white');
  });
});
