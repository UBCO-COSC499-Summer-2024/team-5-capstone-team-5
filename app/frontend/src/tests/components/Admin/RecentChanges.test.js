import React from 'react';
import { render, screen } from '@testing-library/react';
import RecentChanges from './RecentChanges';
import { ThemeContext } from '../../App';

describe('RecentChanges Component', () => {
  beforeEach(() => {
    const changes = [
      { timestamp: '2024-07-01', userId: '1', firstName: 'John', lastName: 'Doe', oldRole: 1, newRole: 2 },
    ];
    localStorage.setItem('changes', JSON.stringify(changes));
  });

  test('renders RecentChanges with stored changes', () => {
    render(
      <ThemeContext.Provider value={{ theme: 'light' }}>
        <RecentChanges />
      </ThemeContext.Provider>
    );

    const timestamp = screen.getByText('2024-07-01');
    const userId = screen.getByText('1');
    const name = screen.getByText('John Doe');
    const oldRole = screen.getByText('Student');
    const newRole = screen.getByText('Instructor');

    expect(timestamp).toBeInTheDocument();
    expect(userId).toBeInTheDocument();
    expect(name).toBeInTheDocument();
    expect(oldRole).toBeInTheDocument();
    expect(newRole).toBeInTheDocument();
  });
});
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import UserManagementModal from './UserManagementModal';

describe('UserManagementModal Component', () => {
  test('renders UserManagementModal and responds to close button', () => {
    const handleClose = jest.fn();
    render(<UserManagementModal isOpen={true} onClose={handleClose} />);

    const closeButton = screen.getByText('×');
    fireEvent.click(closeButton);

    expect(handleClose).toHaveBeenCalled();
  });

  test('fetches and displays users when open', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve([{ id: '1', name: 'John Doe', email: 'johndoe@example.com' }]),
      })
    );

    render(<UserManagementModal isOpen={true} onClose={() => {}} />);

    const userName = await screen.findByText('John Doe (johndoe@example.com)');
    expect(userName).toBeInTheDocument();
  });
});