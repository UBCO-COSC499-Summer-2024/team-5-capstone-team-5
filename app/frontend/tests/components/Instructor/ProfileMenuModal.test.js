// app/frontend/tests/components/Instructor/ProfileMenuModal.test.js

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom';
import ProfileMenuModal from '../../../src/components/Instructor/ProfileMenuModal';
import { useTheme } from '../../../src/App';

// Mock the useTheme hook
jest.mock('../../../src/App', () => ({
  useTheme: jest.fn(),
}));

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('ProfileMenuModal Component', () => {
  const mockUser = {
    image: 'user-image-url',
    name: 'John Doe',
    email: 'john.doe@example.com',
  };
  const mockOnClose = jest.fn();
  const mockOnLogout = jest.fn();
  const mockToggleTheme = jest.fn();

  beforeEach(() => {
    useTheme.mockReturnValue({ theme: 'light', toggleTheme: mockToggleTheme });
  });

  it('renders without crashing when isOpen is true', () => {
    render(
      <BrowserRouter>
        <ProfileMenuModal
          isOpen={true}
          onClose={mockOnClose}
          user={mockUser}
          onLogout={mockOnLogout}
        />
      </BrowserRouter>
    );

    // Check if the user details are rendered
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
  });

  it('does not render when isOpen is false', () => {
    render(
      <BrowserRouter>
        <ProfileMenuModal
          isOpen={false}
          onClose={mockOnClose}
          user={mockUser}
          onLogout={mockOnLogout}
        />
      </BrowserRouter>
    );

    // Check if the user details are not rendered
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    expect(screen.queryByText('john.doe@example.com')).not.toBeInTheDocument();
  });

  it('calls onClose when the close button is clicked', () => {
    render(
      <BrowserRouter>
        <ProfileMenuModal
          isOpen={true}
          onClose={mockOnClose}
          user={mockUser}
          onLogout={mockOnLogout}
        />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText('×'));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('navigates to change password and calls onClose when Change Password is clicked', () => {
    render(
      <BrowserRouter>
        <ProfileMenuModal
          isOpen={true}
          onClose={mockOnClose}
          user={mockUser}
          onLogout={mockOnLogout}
        />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText('Change Password'));
    expect(mockNavigate).toHaveBeenCalledWith('/changePassword');
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('calls onLogout when Log out is clicked', () => {
    render(
      <BrowserRouter>
        <ProfileMenuModal
          isOpen={true}
          onClose={mockOnClose}
          user={mockUser}
          onLogout={mockOnLogout}
        />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText('Log out'));
    expect(mockOnLogout).toHaveBeenCalled();
  });

  it('toggles theme when the theme switch is clicked', () => {
    render(
      <BrowserRouter>
        <ProfileMenuModal
          isOpen={true}
          onClose={mockOnClose}
          user={mockUser}
          onLogout={mockOnLogout}
        />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByRole('checkbox'));
    expect(mockToggleTheme).toHaveBeenCalled();
  });
});
