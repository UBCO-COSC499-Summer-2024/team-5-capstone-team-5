// app/frontend/tests/components/ChangePass.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ChangePass from 'components/ChangePass';
import ChangePassword from 'hooks/ChangePassword';

jest.mock('hooks/ChangePassword');

describe('ChangePass Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the ChangePass component correctly', () => {
    render(<ChangePass id="123" />);

    expect(screen.getByLabelText(/Old Password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/New Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Submit/i })).toBeInTheDocument();
  });

  it('calls ChangePassword with the correct arguments on form submit', async () => {
    render(<ChangePass id="123" />);

    const oldPassInput = screen.getByLabelText(/Old Password/i);
    const newPassInput = screen.getByLabelText(/New Password/i);
    const submitButton = screen.getByRole('button', { name: /Submit/i });

    fireEvent.change(oldPassInput, { target: { value: 'oldPassword123' } });
    fireEvent.change(newPassInput, { target: { value: 'newPassword123' } });

    fireEvent.click(submitButton);

    expect(ChangePassword).toHaveBeenCalledWith('123', 'oldPassword123', 'newPassword123');
  });

  it('prevents default form submission', async () => {
    const handleSubmit = jest.fn((e) => e.preventDefault());
    render(<ChangePass id="123" onSubmit={handleSubmit} />);

    const form = screen.getByText('Submit').closest('form');

    fireEvent.submit(form);

    expect(handleSubmit).toHaveBeenCalled();
  });
});
