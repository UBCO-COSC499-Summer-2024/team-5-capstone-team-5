// tests/components/Instructor/ProfileMenuModal.test.js

import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ProfileMenuModal from '../../../src/components/Instructor/ProfileMenuModal';
import Modal from 'react-modal';
import { useTheme } from '../../../src/App';
import { MemoryRouter } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

jest.mock('../../../src/App', () => ({
  useTheme: jest.fn(),
}));

jest.mock('../../../src/components/Avatar', () => ({ options, size }) => (
  <div data-testid="avatar" style={{ width: size, height: size }} />
));

describe('ProfileMenuModal', () => {
  let navigate;

  beforeAll(() => {
    Modal.setAppElement(document.createElement('div'));
  });

  beforeEach(() => {
    navigate = jest.fn();
    require('react-router-dom').useNavigate.mockReturnValue(navigate);
    useTheme.mockReturnValue({ theme: 'light', toggleTheme: jest.fn() });
  });

  const user = { name: 'John Doe', email: 'john.doe@example.com' };
  const onClose = jest.fn();
  const onLogout = jest.fn();
  const onAvatarSelect = jest.fn();

  const renderComponent = (isOpen) => {
    render(
      <MemoryRouter>
        <ProfileMenuModal
          isOpen={isOpen}
          onClose={onClose}
          user={user}
          onLogout={onLogout}
          onAvatarSelect={onAvatarSelect}
        />
      </MemoryRouter>
    );
  };

  test('renders correctly when open', () => {
    renderComponent(true);

    expect(screen.getByText('Change Password')).toBeInTheDocument();
    expect(screen.getByText('Log out')).toBeInTheDocument();
  });

  test('does not render when closed', () => {
    renderComponent(false);

    expect(screen.queryByText('Change Password')).not.toBeInTheDocument();
  });

  test('calls onClose when close button is clicked', () => {
    renderComponent(true);

    fireEvent.click(screen.getByText('×'));
    expect(onClose).toHaveBeenCalled();
  });

  test('navigates to change password page and closes modal', () => {
    renderComponent(true);

    fireEvent.click(screen.getByText('Change Password'));
    expect(navigate).toHaveBeenCalledWith('/changePassword');
    expect(onClose).toHaveBeenCalled();
  });

  test('calls onLogout when logout button is clicked', () => {
    renderComponent(true);

    fireEvent.click(screen.getByText('Log out'));
    expect(onLogout).toHaveBeenCalled();
  });

  test('toggles theme', () => {
    const toggleTheme = jest.fn();
    useTheme.mockReturnValue({ theme: 'light', toggleTheme });

    renderComponent(true);

    fireEvent.click(screen.getByRole('checkbox'));
    expect(toggleTheme).toHaveBeenCalled();
  });

  test('opens avatar modal when avatar is clicked', () => {
    renderComponent(true);

    fireEvent.click(screen.getByTestId('avatar'));
    expect(screen.getByText('Select Avatar')).toBeInTheDocument();
  });
});

