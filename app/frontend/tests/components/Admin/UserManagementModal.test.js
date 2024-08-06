// app/frontend/tests/components/Admin/UserManagementModal.test.js

import React from 'react';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import UserManagementModal from '../../../src/components/Admin/UserManagementModal';

describe('UserManagementModal', () => {
  const mockUsers = [
    { id: 1, name: 'John Doe', email: 'john.doe@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com' }
  ];

  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockUsers)
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders correctly when open', async () => {
    await act(async () => {
      render(<UserManagementModal isOpen={true} onClose={jest.fn()} />);
    });

    expect(screen.getByText('Manage Users')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('John Doe (john.doe@example.com)')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith (jane.smith@example.com)')).toBeInTheDocument();
    });
  });

  test('does not render when closed', () => {
    render(<UserManagementModal isOpen={false} onClose={jest.fn()} />);

    expect(screen.queryByText('Manage Users')).not.toBeInTheDocument();
  });

  test('fetches and displays users when opened', async () => {
    await act(async () => {
      render(<UserManagementModal isOpen={true} onClose={jest.fn()} />);
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/users');
    });

    expect(screen.getByText('John Doe (john.doe@example.com)')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith (jane.smith@example.com)')).toBeInTheDocument();
  });

  test('calls onClose when close button is clicked', () => {
    const onClose = jest.fn();
    render(<UserManagementModal isOpen={true} onClose={onClose} />);

    fireEvent.click(screen.getByText('×'));

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
