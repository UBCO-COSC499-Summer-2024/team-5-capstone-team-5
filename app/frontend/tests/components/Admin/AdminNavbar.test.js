// app/frontend/tests/components/Admin/AdminNavbar.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter as Router } from 'react-router-dom';
import AdminNavbar from '../../../src/components/Admin/AdminNavbar';
import { useTheme } from '../../../src/App';
import validateUser from '../../../src/hooks/validateUser';
import getUserInfo from '../../../src/hooks/getUserInfo';
import ProfileMenuModal from '../../../src/components/Instructor/ProfileMenuModal';

jest.mock('../../../src/hooks/validateUser');
jest.mock('../../../src/hooks/getUserInfo');
jest.mock('../../../src/App', () => ({
  useTheme: jest.fn(() => ({ theme: 'light' }))
}));

jest.mock('../../../src/components/Instructor/ProfileMenuModal', () => jest.fn(({ isOpen, onClose, user, onLogout }) => {
  return isOpen ? (
    <div>
      <button onClick={onLogout}>Logout</button>
    </div>
  ) : null;
}));

validateUser.mockResolvedValue(true);
getUserInfo.mockResolvedValue({
  name: 'John Doe',
  userEmail: 'johndoe@example.com'
});

describe('AdminNavbar', () => {
  test('renders AdminNavbar component', async () => {
    render(
      <Router>
        <AdminNavbar />
      </Router>
    );

    // Check if the logo is rendered
    const logoImage = screen.getByAltText('Logo');
    expect(logoImage).toBeInTheDocument();

    // Check if the home button is rendered
    const homeButton = screen.getByText('Home');
    expect(homeButton).toBeInTheDocument();

    // Check if the Manage Users button is rendered
    const manageUsersButton = screen.getByText('Manage Users');
    expect(manageUsersButton).toBeInTheDocument();

    // Check if the Recent Changes button is rendered
    const recentChangesButton = screen.getByText('Recent Changes');
    expect(recentChangesButton).toBeInTheDocument();

    // Check if the Admin Statistics button is rendered
    const adminStatisticsButton = screen.getByText('Admin Statistics');
    expect(adminStatisticsButton).toBeInTheDocument();

    // Check if the user profile image is rendered
    const userImage = screen.getByAltText('User');
    expect(userImage).toBeInTheDocument();

    // Check if the About link is rendered
    const aboutLink = screen.getByText('About');
    expect(aboutLink).toBeInTheDocument();

    // Check if the Contact link is rendered
    const contactLink = screen.getByText('Contact');
    expect(contactLink).toBeInTheDocument();
  });

  test('opens profile menu modal on button click', async () => {
    await act(async () => {
      render(
        <Router>
          <AdminNavbar />
        </Router>
      );
    });

    // Check if profile menu button is rendered and click it
    const profileMenuButton = screen.getByRole('button', { name: /John Doe/i });
    act(() => {
      fireEvent.click(profileMenuButton);
    });

    // Check if the profile menu modal is opened
    await waitFor(() => {
      const logoutButton = screen.getByText('Logout');
      expect(logoutButton).toBeInTheDocument();
    });
  });
});
