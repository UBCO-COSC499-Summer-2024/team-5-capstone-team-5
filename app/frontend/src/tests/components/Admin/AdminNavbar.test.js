import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AdminNavbar from '../../../components/Admin/AdminNavbar';


describe('AdminNavbar Component', () => {
  test('renders AdminNavbar with navigation links', () => {
    render(
      <BrowserRouter>
        <AdminNavbar />
      </BrowserRouter>
    );

    const homeButton = screen.getByText('Home');
    const manageUsersButton = screen.getByText('Manage Users');
    const recentChangesButton = screen.getByText('Recent Changes');

    expect(homeButton).toBeInTheDocument();
    expect(manageUsersButton).toBeInTheDocument();
    expect(recentChangesButton).toBeInTheDocument();
  });
});