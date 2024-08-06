// app/frontend/tests/components/Admin/RecentChanges.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import RecentChanges from '../../../src/components/Admin/RecentChanges';
import { useTheme } from '../../../src/App';

jest.mock('../../../src/App', () => ({
  useTheme: jest.fn()
}));

describe('RecentChanges', () => {
  const mockChanges = [
    {
      timestamp: '2024-08-05T12:34:56Z',
      userId: 'user123',
      firstName: 'John',
      lastName: 'Doe',
      oldRole: 1,
      newRole: 2
    },
    {
      timestamp: '2024-08-04T11:33:55Z',
      userId: 'user456',
      firstName: 'Jane',
      lastName: 'Smith',
      oldRole: 2,
      newRole: 3
    }
  ];

  beforeAll(() => {
    localStorage.setItem('changes', JSON.stringify(mockChanges));
  });

  afterAll(() => {
    localStorage.removeItem('changes');
  });

  test('renders RecentChanges component with light theme', () => {
    useTheme.mockReturnValue({ theme: 'light' });

    render(<RecentChanges />);

    const heading = screen.getByText('Recent Changes');
    expect(heading).toBeInTheDocument();

    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(mockChanges.length + 1); // +1 for the header row

    const firstRowCells = screen.getAllByRole('cell');
    expect(firstRowCells[0]).toHaveTextContent('2024-08-04T11:33:55Z');
    expect(firstRowCells[1]).toHaveTextContent('user456');
    expect(firstRowCells[2]).toHaveTextContent('Jane Smith');
    expect(firstRowCells[3]).toHaveTextContent('Instructor');
    expect(firstRowCells[4]).toHaveTextContent('Admin');
  });

  test('renders RecentChanges component with dark theme', () => {
    useTheme.mockReturnValue({ theme: 'dark' });

    render(<RecentChanges />);

    const heading = screen.getByText('Recent Changes');
    expect(heading).toBeInTheDocument();

    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(mockChanges.length + 1); // +1 for the header row

    const firstRowCells = screen.getAllByRole('cell');
    expect(firstRowCells[0]).toHaveTextContent('2024-08-04T11:33:55Z');
    expect(firstRowCells[1]).toHaveTextContent('user456');
    expect(firstRowCells[2]).toHaveTextContent('Jane Smith');
    expect(firstRowCells[3]).toHaveTextContent('Instructor');
    expect(firstRowCells[4]).toHaveTextContent('Admin');
  });
});
