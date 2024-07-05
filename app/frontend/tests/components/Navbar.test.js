// app/frontend/tests/components/Navbar.test.js

import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom';
import Navbar from '../../../src/components/Navbar';
import validateUser from '../../../src/hooks/validateUser';
import getUserInfo from '../../../src/hooks/getUserInfo';
import getCourseData from '../../../src/hooks/getCourseData';
import { useTheme } from '../../../src/App';

// Mock the hooks
jest.mock('../../../src/hooks/validateUser');
jest.mock('../../../src/hooks/getUserInfo');
jest.mock('../../../src/hooks/getCourseData');
jest.mock('../../../src/App', () => ({
  useTheme: jest.fn(),
}));

describe('Navbar Component', () => {
  const mockUser = {
    name: 'John Doe',
    userEmail: 'johndoe@example.com',
    role: 1
  };

  const mockCourses = [
    { course_id: 1, name: 'Course 1', description: 'Description 1', end_date: '2023-12-31' },
    { course_id: 2, name: 'Course 2', description: 'Description 2', end_date: '2023-12-31' },
  ];

  beforeEach(() => {
    validateUser.mockResolvedValue(true);
    getUserInfo.mockResolvedValue(mockUser);
    getCourseData.mockResolvedValue(mockCourses);
    useTheme.mockReturnValue({ theme: 'light' });
  });

  it('renders without crashing and displays user information', async () => {
    render(
      <BrowserRouter>
        <Navbar id="123" />
      </BrowserRouter>
    );

    // Wait for the user information to be fetched and displayed
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('johndoe@example.com')).toBeInTheDocument();
      expect(screen.getByText('Student')).toBeInTheDocument();
    });

    // Check if the logo is rendered
    expect(screen.getByAltText('Logo')).toBeInTheDocument();

    // Check if the navigation links are rendered
    expect(screen.getByText('Recent Courses')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });

  it('fetches and displays course data', async () => {
    render(
      <BrowserRouter>
        <Navbar id="123" />
      </BrowserRouter>
    );

    // Wait for the course data to be fetched and displayed
    await waitFor(() => {
      mockCourses.forEach(course => {
        expect(screen.getByText(course.name)).toBeInTheDocument();
        expect(screen.getByText(course.description)).toBeInTheDocument();
        expect(screen.getByText('Ends: 2023-12-31')).toBeInTheDocument();
      });
    });
  });

  it('handles logout', async () => {
    render(
      <BrowserRouter>
        <Navbar id="123" />
      </BrowserRouter>
    );

    // Open the profile menu
    fireEvent.click(screen.getByText('John Doe'));

    // Wait for the profile menu to open
    await waitFor(() => {
      expect(screen.getByText('Log out')).toBeInTheDocument();
    });

    // Simulate logout
    fireEvent.click(screen.getByText('Log out'));

    // Check if the token is removed from localStorage
    expect(localStorage.getItem('token')).toBeNull();
  });

  it('redirects to login if the session is invalid', async () => {
    validateUser.mockResolvedValueOnce(false);

    const mockNavigate = jest.fn();
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useNavigate: () => mockNavigate,
    }));

    render(
      <BrowserRouter>
        <Navbar id="123" />
      </BrowserRouter>
    );

    // Wait for the session validation
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });
});
