// app/frontend/tests/components/Instructor/ProfileMenuModal.test.js

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom';
import ProfileMenuModal from '../../../src/components/Instructor/ProfileMenuModal';
import { useTheme } from '../../../src/App';

// Mock the necessary modules
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: jest.fn(),
  };
});

jest.mock('../../../src/App', () => ({
  useTheme: jest.fn(),
}));

describe('ProfileMenuModal Component', () => {
  const mockUser = {
    name: 'John Doe',
    email: 'johndoe@example.com',
    image: 'https://via.placeholder.com/150',
  };
  const mockOnClose = jest.fn();
  const mockOnLogout = jest.fn();
  const mockNavigate = jest.fn();
  const mockToggleTheme = jest.fn();

  beforeEach(() => {
    useTheme.mockReturnValue({ theme: 'light', toggleTheme: mockToggleTheme });
    const { useNavigate } = require('react-router-dom');
    useNavigate.mockReturnValue(mockNavigate);
  });

  it('renders and displays user information correctly', () => {
    render(
      <BrowserRouter>
        <ProfileMenuModal isOpen={true} onClose={mockOnClose} user={mockUser} onLogout={mockOnLogout} />
      </BrowserRouter>
    );

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('johndoe@example.com')).toBeInTheDocument();
  });

  it('handles Change Password button click correctly', () => {
    render(
      <BrowserRouter>
        <ProfileMenuModal isOpen={true} onClose={mockOnClose} user={mockUser} onLogout={mockOnLogout} />
      </BrowserRouter>
    );

    const changePasswordButton = screen.getByText('Change Password');
    fireEvent.click(changePasswordButton);

    expect(mockNavigate).toHaveBeenCalledWith('/changePassword');
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('handles Change Theme switch correctly', () => {
    render(
      <BrowserRouter>
        <ProfileMenuModal isOpen={true} onClose={mockOnClose} user={mockUser} onLogout={mockOnLogout} />
      </BrowserRouter>
    );

    const themeSwitch = screen.getByRole('checkbox');
    fireEvent.click(themeSwitch);

    expect(mockToggleTheme).toHaveBeenCalled();
  });

  it('handles Log out button click correctly', () => {
    render(
      <BrowserRouter>
        <ProfileMenuModal isOpen={true} onClose={mockOnClose} user={mockUser} onLogout={mockOnLogout} />
      </BrowserRouter>
    );

    const logoutButton = screen.getByText('Log out');
    fireEvent.click(logoutButton);

    expect(mockOnLogout).toHaveBeenCalled();
  });

  it('closes the modal when the close button is clicked', () => {
    render(
      <BrowserRouter>
        <ProfileMenuModal isOpen={true} onClose={mockOnClose} user={mockUser} onLogout={mockOnLogout} />
      </BrowserRouter>
    );

    const closeButton = screen.getByText('×');
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('does not render when isOpen is false', () => {
    render(
      <BrowserRouter>
        <ProfileMenuModal isOpen={false} onClose={mockOnClose} user={mockUser} onLogout={mockOnLogout} />
      </BrowserRouter>
    );

    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
  });
});
