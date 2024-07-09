import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ProfileMenuModal from 'components/ProfileMenuModal';
import { useTheme } from 'App';

jest.mock('App', () => ({
  useTheme: jest.fn(),
}));

const mockToggleTheme = jest.fn();
const mockUseTheme = {
  theme: 'light',
  toggleTheme: mockToggleTheme,
};

describe('ProfileMenuModal Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useTheme.mockReturnValue(mockUseTheme);
  });

  const mockUser = {
    name: 'John Doe',
    email: 'johndoe@example.com',
    image: 'https://via.placeholder.com/150',
  };

  const mockOnClose = jest.fn();
  const mockOnLogout = jest.fn();

  it('renders correctly when open', () => {
    render(<ProfileMenuModal isOpen={true} onClose={mockOnClose} user={mockUser} onLogout={mockOnLogout} />);

    expect(screen.getByText(mockUser.name)).toBeInTheDocument();
    expect(screen.getByText(mockUser.email)).toBeInTheDocument();
    expect(screen.getByText(/change password/i)).toBeInTheDocument();
    expect(screen.getByText(/change theme/i)).toBeInTheDocument();
    expect(screen.getByText(/log out/i)).toBeInTheDocument();
  });

  it('does not render when not open', () => {
    const { container } = render(<ProfileMenuModal isOpen={false} onClose={mockOnClose} user={mockUser} onLogout={mockOnLogout} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('calls onClose when close button is clicked', () => {
    render(<ProfileMenuModal isOpen={true} onClose={mockOnClose} user={mockUser} onLogout={mockOnLogout} />);

    fireEvent.click(screen.getByText('×'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls toggleTheme when theme switch is toggled', () => {
    render(<ProfileMenuModal isOpen={true} onClose={mockOnClose} user={mockUser} onLogout={mockOnLogout} />);

    const themeSwitch = screen.getByLabelText('Change Theme');
    fireEvent.click(themeSwitch);
    expect(mockToggleTheme).toHaveBeenCalledTimes(1);
  });

  it('calls onLogout when log out button is clicked', () => {
    render(<ProfileMenuModal isOpen={true} onClose={mockOnClose} user={mockUser} onLogout={mockOnLogout} />);

    fireEvent.click(screen.getByText(/log out/i));
    expect(mockOnLogout).toHaveBeenCalledTimes(1);
  });
});
