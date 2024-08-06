// app/frontend/tests/components/Admin/SiteStatistics.test.js
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import SiteStatistics from '../../../src/components/Admin/SiteStatistics';
import { useTheme } from '../../../src/App';

jest.mock('../../../src/App', () => ({
  useTheme: jest.fn()
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ '1': 10, '2': 5, '3': 2 })
  })
);

describe('SiteStatistics', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('renders SiteStatistics component with light theme and data', async () => {
    useTheme.mockReturnValue({ theme: 'light' });

    render(<SiteStatistics />);

    expect(screen.getByText('Site Statistics')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Student')).toBeInTheDocument();
      expect(screen.getByText('Instructor')).toBeInTheDocument();
      expect(screen.getByText('Admin')).toBeInTheDocument();
      expect(screen.getByText('10')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
    });
  });

  test('renders SiteStatistics component with dark theme and data', async () => {
    useTheme.mockReturnValue({ theme: 'dark' });

    render(<SiteStatistics />);

    expect(screen.getByText('Site Statistics')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Student')).toBeInTheDocument();
      expect(screen.getByText('Instructor')).toBeInTheDocument();
      expect(screen.getByText('Admin')).toBeInTheDocument();
      expect(screen.getByText('10')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
    });
  });

  test('renders error message on fetch failure', async () => {
    fetch.mockImplementationOnce(() =>
      Promise.reject(new Error('Fetch error'))
    );

    useTheme.mockReturnValue({ theme: 'light' });

    render(<SiteStatistics />);

    await waitFor(() => {
      expect(screen.getByText('Error: Fetch error')).toBeInTheDocument();
    });
  });

  test('renders no statistics available message when data is empty', async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({})
      })
    );

    useTheme.mockReturnValue({ theme: 'light' });

    render(<SiteStatistics />);

    await waitFor(() => {
      expect(screen.getByText('No statistics available.')).toBeInTheDocument();
    });
  });
});
