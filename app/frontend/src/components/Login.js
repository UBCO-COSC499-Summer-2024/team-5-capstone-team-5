import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter as Router } from 'react-router-dom';
import Login from '../../../src/components/Login';
import { useTheme } from '../../../src/App';

// Mocking useTheme and Toast components
jest.mock('../../../src/App', () => ({
  useTheme: jest.fn(),
}));
jest.mock('../../../src/components/Toast', () => ({ message, type, onClose }) => (
  <div data-testid="toast">
    <p>{message}</p>
    <p>{type}</p>
    <button onClick={onClose}>Close</button>
  </div>
));

global.fetch = jest.fn();

describe('Login Component', () => {
  const mockUseTheme = { theme: 'dark' };

  beforeEach(() => {
    useTheme.mockReturnValue(mockUseTheme);
    fetch.mockClear();
  });

  const renderComponent = () => {
    return render(
      <Router>
        <Login />
      </Router>
    );
  };

  it('renders without crashing', () => {
    renderComponent();
    expect(screen.getByPlaceholderText(/Enter your email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter your password/i)).toBeInTheDocument();
    expect(screen.getByText(/Login/i)).toBeInTheDocument();
  });

  it('handles input changes', () => {
    renderComponent();
    const emailInput = screen.getByPlaceholderText(/Enter your email/i);
    const passwordInput = screen.getByPlaceholderText(/Enter your password/i);

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  it('toggles password visibility', () => {
    renderComponent();
    const passwordInput = screen.getByPlaceholderText(/Enter your password/i);
    const toggleButton = screen.getByRole('button', { name: /Eye/i });

    expect(passwordInput.type).toBe('password');
    fireEvent.click(toggleButton);
    expect(passwordInput.type).toBe('text');
    fireEvent.click(toggleButton);
    expect(passwordInput.type).toBe('password');
  });

  it('shows success toast on successful login', async () => {
    fetch.mockResolvedValueOnce({
      status: 200,
      json: async () => ({ token: 'fake-token' }),
    });

    renderComponent();

    fireEvent.change(screen.getByPlaceholderText(/Enter your email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter your password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByText(/Login/i));

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(screen.getByTestId('toast')).toHaveTextContent(/Login successful!/i));
  });

  it('shows error toast on failed login', async () => {
    fetch.mockResolvedValueOnce({
      status: 401,
    });

    renderComponent();

    fireEvent.change(screen.getByPlaceholderText(/Enter your email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter your password/i), { target: { value: 'wrongpassword' } });
    fireEvent.click(screen.getByText(/Login/i));

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(screen.getByTestId('toast')).toHaveTextContent(/Incorrect Credentials/i));
  });
});
