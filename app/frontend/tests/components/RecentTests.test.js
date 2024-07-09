// app/frontend/tests/components/RecentTests.test.js

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import RecentTests from 'components/RecentTests';
import getRecentTests from 'hooks/getRecentTests';

jest.mock('hooks/getRecentTests');

const mockTests = [
  {
    name: 'Test 1',
    date_marked: '2023-05-01T00:00:00Z',
    course_name: 'Math 101',
  },
  {
    name: 'Test 2',
    date_marked: '2023-06-01T00:00:00Z',
    course_name: 'Math 102',
  },
];

describe('RecentTests Component', () => {
  beforeEach(() => {
    getRecentTests.mockResolvedValue(mockTests);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', async () => {
    render(<RecentTests id="123" />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders recent tests after loading', async () => {
    render(<RecentTests id="123" />);

    await waitFor(() => expect(getRecentTests).toHaveBeenCalledWith('123'));

    mockTests.forEach(test => {
      expect(screen.getByText(test.name)).toBeInTheDocument();
      expect(screen.getByText(`Date Marked: ${test.date_marked.slice(0, 10)}`)).toBeInTheDocument();
      expect(screen.getByText(`Course: ${test.course_name}`)).toBeInTheDocument();
    });
  });

  it('handles no tests scenario', async () => {
    getRecentTests.mockResolvedValueOnce([]);

    render(<RecentTests id="123" />);

    await waitFor(() => expect(getRecentTests).toHaveBeenCalledWith('123'));

    expect(screen.getByText('No tests available')).toBeInTheDocument();
  });
});
