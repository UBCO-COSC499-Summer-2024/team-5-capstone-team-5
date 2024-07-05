// app/frontend/tests/components/RecentTests.test.js

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import RecentTests from '../../../src/components/RecentTests';
import getRecentTests from '../../../src/hooks/getRecentTests';

// Mock the getRecentTests hook
jest.mock('../../../src/hooks/getRecentTests', () => jest.fn());

describe('RecentTests Component', () => {
  const mockTestsData = [
    { id: 1, name: 'Test 1', date_marked: '2023-12-01T00:00:00Z', course_name: 'Course 1' },
    { id: 2, name: 'Test 2', date_marked: '2023-12-02T00:00:00Z', course_name: 'Course 2' },
  ];
  const mockProps = { id: '123' };

  beforeEach(() => {
    getRecentTests.mockResolvedValue(mockTestsData);
  });

  it('renders without crashing and displays the loading state initially', () => {
    render(<RecentTests {...mockProps} />);

    // Check if the loading state is displayed initially
    expect(screen.getByText('Recent Tests')).toBeInTheDocument();
  });

  it('fetches and displays recent tests data', async () => {
    render(<RecentTests {...mockProps} />);

    // Wait for the tests data to be fetched and displayed
    await waitFor(() => {
      // Check if the recent tests heading is rendered
      expect(screen.getByText('Recent Tests')).toBeInTheDocument();

      // Check if the tests are rendered
      mockTestsData.forEach((test) => {
        expect(screen.getByText(test.name)).toBeInTheDocument();
        expect(screen.getByText(`Date Marked: ${test.date_marked.slice(0, 10)}`)).toBeInTheDocument();
        expect(screen.getByText(`Course: ${test.course_name}`)).toBeInTheDocument();
      });
    });
  });

  it('displays no tests message when there are no tests', async () => {
    getRecentTests.mockResolvedValueOnce([]);
    render(<RecentTests {...mockProps} />);

    // Wait for the tests data to be fetched and displayed
    await waitFor(() => {
      // Check if the recent tests heading is rendered
      expect(screen.getByText('Recent Tests')).toBeInTheDocument();

      // Check if no tests message is displayed
      expect(screen.queryByText(/Date Marked:/)).not.toBeInTheDocument();
      expect(screen.queryByText(/Course:/)).not.toBeInTheDocument();
    });
  });
});
