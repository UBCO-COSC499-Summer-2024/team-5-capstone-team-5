// tests/components/Navbar.test.js

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom';
import Navbar from 'components/Navbar';
import getCourseData from 'hooks/getCourseData';
import validateUser from 'hooks/validateUser';
import getUserInfo from 'hooks/getUserInfo';
import { useTheme } from 'App';

// Mock the hooks
jest.mock('hooks/getCourseData');
jest.mock('hooks/validateUser');
jest.mock('hooks/getUserInfo');
jest.mock('App', () => ({
  useTheme: jest.fn(),
}));

const mockCourses = [
  {
    course_id: 1,
    name: 'Course 1',
    description: 'Description for Course 1',
    end_date: '2023-12-31',
  },
  {
    course_id: 2,
    name: 'Course 2',
    description: 'Description for Course 2',
    end_date: '2023-12-31',
  },
];

const mockUser = {
  name: 'John Doe',
  userEmail: 'johndoe@example.com',
  role: 1,
};

describe('Navbar Component', () => {
  beforeEach(() => {
    validateUser.mockResolvedValue(true);
    getUserInfo.mockResolvedValue(mockUser);
    getCourseData.mockResolvedValue(mockCourses);
    useTheme.mockReturnValue({ theme: 'light' });
  });

  it('renders without crashing and displays courses', async () => {
    render(
      <BrowserRouter>
        <Navbar id="123" />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Course 1')).toBeInTheDocument();
      expect(screen.getByText('Course 2')).toBeInTheDocument();
    });
  });

  it('redirects to login if the session is not valid', async () => {
    validateUser.mockResolvedValue(false);
    render(
      <BrowserRouter>
        <Navbar id="123" />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(window.location.pathname).toBe('/login');
    });
  });

  it('opens and closes the profile menu', async () => {
    render(
      <BrowserRouter>
        <Navbar id="123" />
      </BrowserRouter>
    );

    await waitFor(() => {
      fireEvent.click(screen.getByText(mockUser.name));
    });

    expect(screen.getByText('Change Password')).toBeInTheDocument();

    fireEvent.click(screen.getByText('×'));

    await waitFor(() => {
      expect(screen.queryByText('Change Password')).not.toBeInTheDocument();
    });
  });

  it('logs out the user', async () => {
    render(
      <BrowserRouter>
        <Navbar id="123" />
      </BrowserRouter>
    );

    await waitFor(() => {
      fireEvent.click(screen.getByText(mockUser.name));
    });

    fireEvent.click(screen.getByText('Log out'));

    expect(localStorage.getItem('token')).toBeNull();
    expect(window.location.pathname).toBe('/login');
  });
});
