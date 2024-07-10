// app/frontend/tests/components/Login.test.js

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom';
import Login from 'components/Login';

describe('Login Component', () => {
  beforeEach(() => {
    // Mocking fetch
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ token: 'fakeToken' }),
      })
    );
    // Mocking localStorage
    const localStorageMock = (function() {
      let store = {};
      return {
        getItem(key) {
          return store[key] || null;
        },
        setItem(key, value) {
          store[key] = value.toString();
        },
        clear() {
          store = {};
        },
        removeItem(key) {
          delete store[key];
        },
      };
    })();
    Object.defineProperty(global, 'localStorage', { value: localStorageMock });
    jest.spyOn(global.localStorage, 'setItem');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing and displays the logo and form', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    // Check if the logo is present
    const logo = screen.getByAltText('Logo');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', '/gradeit.svg');

    // Check if the form elements are present
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('handles form submission successfully', async () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    // Fill in the form
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password' } });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      // Check if fetch was called with the correct arguments
      expect(fetch).toHaveBeenCalledWith('http://localhost/api/auth/login', expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@example.com', password: 'password' }),
        credentials: 'include',
      }));
    });

    // Check if localStorage.setItem was called with the correct arguments
    expect(localStorage.setItem).toHaveBeenCalledWith('token', 'fakeToken');

    // Check if navigation occurred
    expect(window.location.pathname).toBe('/');
  });

  it('handles unsuccessful login attempts', async () => {
    // Mocking fetch to return an unsuccessful response
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
      })
    );

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    // Fill in the form
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'wrongpassword' } });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      // Check if fetch was called with the correct arguments
      expect(fetch).toHaveBeenCalledWith('http://localhost/api/auth/login', expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@example.com', password: 'wrongpassword' }),
        credentials: 'include',
      }));
    });

    // Check if localStorage.setItem was not called
    expect(localStorage.setItem).not.toHaveBeenCalled();

    // Since navigation does not occur, we can't check window.location.pathname here
  });

  it('toggles password visibility', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    const passwordInput = screen.getByLabelText(/password/i);
    const toggleButton = screen.getByTestId('togglePasswordVisibility');

    // Check initial type of password input
    expect(passwordInput).toHaveAttribute('type', 'password');

    // Click the toggle button to show the password
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');

    // Click the toggle button again to hide the password
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });
});
