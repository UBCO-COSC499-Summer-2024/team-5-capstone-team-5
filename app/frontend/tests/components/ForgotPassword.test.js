// app/frontend/tests/components/ForgotPassword.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import ForgotPassword from '@components/ForgotPassword';
import { useTheme } from '@app/App';
import { useNavigate } from 'react-router-dom';

jest.mock('@app/App', () => ({
  useTheme: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

const mockUseNavigate = useNavigate;

describe('ForgotPassword', () => {
  beforeEach(() => {
    useTheme.mockReturnValue({ theme: 'light' });
    mockUseNavigate.mockReturnValue(jest.fn());
    jest.clearAllMocks();
  });

  const renderComponent = () => render(<ForgotPassword />);

  test('renders the ForgotPassword component', () => {
    renderComponent();

    expect(screen.getByText('Password Recovery')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
  });

  test('handles input changes', () => {
    renderComponent();

    const emailInput = screen.getByPlaceholderText('Enter your email');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    expect(emailInput.value).toBe('test@example.com');
  });

  test('submits the form successfully', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        status: 200,
        json: () => Promise.resolve({ message: 'Password reset email sent' }),
      })
    );

    renderComponent();

    const emailInput = screen.getByPlaceholderText('Enter your email');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    await act(async () => {
      fireEvent.submit(screen.getByText('Submit'));
    });

    await waitFor(() => {
      expect(screen.getByText('Password reset email sent')).toBeInTheDocument();
    });

    global.fetch.mockRestore();
  });

  test('displays error message on failed submission', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        status: 500,
      })
    );

    renderComponent();

    const emailInput = screen.getByPlaceholderText('Enter your email');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    await act(async () => {
      fireEvent.submit(screen.getByText('Submit'));
    });

    await waitFor(() => {
      expect(screen.getByText('Error sending password reset email')).toBeInTheDocument();
    });

    global.fetch.mockRestore();
  });

  test('navigates to login page on cancel', () => {
    const mockNavigate = jest.fn();
    mockUseNavigate.mockReturnValue(mockNavigate);

    renderComponent();

    fireEvent.click(screen.getByText('Cancel'));

    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});
