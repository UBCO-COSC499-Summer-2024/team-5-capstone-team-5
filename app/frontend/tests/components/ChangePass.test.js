// app/frontend/tests/components/ChangePass.test.js

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ChangePass from '../../../src/components/ChangePass';
import ChangePassword from '../../../src/hooks/ChangePassword';

// Mock the ChangePassword hook
jest.mock('../../../src/hooks/ChangePassword');

describe('ChangePass Component', () => {
  const mockUserId = '123';

  it('renders without crashing and displays the form elements', () => {
    render(<ChangePass id={mockUserId} />);

    // Check if the labels are rendered
    expect(screen.getByLabelText('Old Password')).toBeInTheDocument();
    expect(screen.getByLabelText('New Password')).toBeInTheDocument();

    // Check if the submit button is rendered
    expect(screen.getByText('Submit')).toBeInTheDocument();
  });

  it('handles input changes correctly', () => {
    render(<ChangePass id={mockUserId} />);

    const oldPassInput = screen.getByLabelText('Old Password');
    const newPassInput = screen.getByLabelText('New Password');

    // Simulate user input
    fireEvent.change(oldPassInput, { target: { value: 'oldpassword' } });
    fireEvent.change(newPassInput, { target: { value: 'newpassword' } });

    // Check if the input values are updated correctly
    expect(oldPassInput.value).toBe('oldpassword');
    expect(newPassInput.value).toBe('newpassword');
  });

  it('submits the form with the correct data', () => {
    render(<ChangePass id={mockUserId} />);

    const oldPassInput = screen.getByLabelText('Old Password');
    const newPassInput = screen.getByLabelText('New Password');
    const submitButton = screen.getByText('Submit');

    // Simulate user input
    fireEvent.change(oldPassInput, { target: { value: 'oldpassword' } });
    fireEvent.change(newPassInput, { target: { value: 'newpassword' } });

    // Simulate form submission
    fireEvent.click(submitButton);

    // Check if ChangePassword was called with the correct arguments
    expect(ChangePassword).toHaveBeenCalledWith(mockUserId, 'oldpassword', 'newpassword');
  });
});
