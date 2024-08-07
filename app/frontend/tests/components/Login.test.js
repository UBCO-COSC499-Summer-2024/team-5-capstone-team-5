// app/frontend/tests/components/Login.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import Login from '@components/Login';
import { useTheme } from '@app/App';
import { useNavigate } from 'react-router-dom';

jest.mock('@app/App', () => ({
  useTheme: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

describe('Login', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    useTheme.mockReturnValue({ theme: 'light' });
    useNavigate.mockReturnValue(mockNavigate);
    jest.clearAllMocks();
  });

  const renderComponent = () => render(<Login />);

  test('renders Login component with light theme', () => {
    renderComponent();

    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Forgot password?')).toBeInTheDocument();
    expect(screen.getByText('Click here')).toHaveAttribute('href', '/forgot-password');
  });

  test('renders Login component with dark theme', () => {
    useTheme.mockReturnValue({ theme: 'dark' });
    renderComponent();

    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Forgot password?')).toBeInTheDocument();
    expect(screen.getByText('Click here')).toHaveAttribute('href', '/forgot-password');
  });

  test('handles email and password input changes', () => {
    renderComponent();

    fireEvent.change(screen.getByPlaceholderText('Enter your email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), { target: { value: 'password123' } });

    expect(screen.getByPlaceholderText('Enter your email').value).toBe('test@example.com');
    expect(screen.getByPlaceholderText('Enter your password').value).toBe('password123');
  });

  test('toggles password visibility', () => {
    renderComponent();

    const passwordInput = screen.getByPlaceholderText('Enter your password');
    const toggleButton = screen.getByRole('button', { name: '' });

    // Initially password should be hidden
    expect(passwordInput.type).toBe('password');

    // Toggle password visibility
    fireEvent.click(toggleButton);
    expect(passwordInput.type).toBe('text');

    // Toggle back to hidden
    fireEvent.click(toggleButton);
    expect(passwordInput.type).toBe('password');
  });

  test('handles successful login', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        status: 200,
        json: () => Promise.resolve({ token: 'fake-token' }),
      })
    );

    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

    renderComponent();

    fireEvent.change(screen.getByPlaceholderText('Enter your email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), { target: { value: 'password123' } });

    await act(async () => {
      fireEvent.click(screen.getByText('Login'));
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('http://localhost/api/auth/login', expect.any(Object));
      expect(setItemSpy).toHaveBeenCalledWith('token', 'fake-token');
      expect(screen.getByText('Login successful!')).toBeInTheDocument();
    });

    global.fetch.mockRestore();
    setItemSpy.mockRestore();
  });

  test('handles failed login with incorrect credentials', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        status: 401,
        json: () => Promise.resolve({ message: 'Incorrect Credentials' }),
      })
    );

    renderComponent();

    fireEvent.change(screen.getByPlaceholderText('Enter your email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), { target: { value: 'wrongpassword' } });

    await act(async () => {
      fireEvent.click(screen.getByText('Login'));
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('http://localhost/api/auth/login', expect.any(Object));
      expect(screen.getByText('Incorrect Credentials')).toBeInTheDocument();
    });

    global.fetch.mockRestore();
  });

  test('handles failed login with server error', async () => {
    global.fetch = jest.fn(() =>
      Promise.reject(new Error('Internal Server Error'))
    );

    renderComponent();

    fireEvent.change(screen.getByPlaceholderText('Enter your email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), { target: { value: 'password123' } });

    await act(async () => {
      fireEvent.click(screen.getByText('Login'));
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('http://localhost/api/auth/login', expect.any(Object));
      expect(screen.getByText('Internal Server Error')).toBeInTheDocument();
    });

    global.fetch.mockRestore();
  });
});
