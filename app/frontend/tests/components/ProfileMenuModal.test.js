// app/frontend/tests/components/ProfileMenuModal.test.js

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ProfileMenuModal from '../../../src/components/ProfileMenuModal';
import { useTheme } from '../../../src/App';

// Mock the useTheme hook
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
  const mockToggleTheme = jest.fn();

  beforeEach(() => {
    useTheme.mockReturnValue({ theme: 'light', toggleTheme: mockToggleTheme });
  });

  it('renders without crashing and displays user information', () => {
    render(
      <ProfileMenuModal
        isOpen={true}
        onClose={mockOnClose}
        user={mockUser}
        onLogout={mockOnLogout}
      />
    );

    // Check if the user information is displayed
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('johndoe@example.com')).toBeInTheDocument();

    // Check if the buttons are rendered
    expect(screen.getByText('Change Password')).toBeInTheDocument();
    expect(screen.getByText('Log out')).toBeInTheDocument();
  });

  it('calls onClose when the close button is clicked', () => {
    render(
      <ProfileMenuModal
        isOpen={true}
        onClose={mockOnClose}
        user={mockUser}
        onLogout={mockOnLogout}
      />
    );

    // Click the close button
    fireEvent.click(screen.getByText('×'));

    // Check if the onClose callback is called
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('calls onLogout when the log out button is clicked', () => {
    render(
      <ProfileMenuModal
        isOpen={true}
        onClose={mockOnClose}
        user={mockUser}
        onLogout={mockOnLogout}
      />
    );

    // Click the log out button
    fireEvent.click(screen.getByText('Log out'));

    // Check if the onLogout callback is called
    expect(mockOnLogout).toHaveBeenCalled();
  });

  it('toggles theme when the theme switch is changed', () => {
    render(
      <ProfileMenuModal
        isOpen={true}
        onClose={mockOnClose}
        user={mockUser}
        onLogout={mockOnLogout}
      />
    );

    // Click the theme toggle switch
    fireEvent.click(screen.getByRole('checkbox'));

    // Check if the toggleTheme callback is called
    expect(mockToggleTheme).toHaveBeenCalled();
  });

  it('does not render when isOpen is false', () => {
    render(
      <ProfileMenuModal
        isOpen={false}
        onClose={mockOnClose}
        user={mockUser}
        onLogout={mockOnLogout}
      />
    );

    // Check if the modal content is not rendered
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    expect(screen.queryByText('johndoe@example.com')).not.toBeInTheDocument();
  });
});
