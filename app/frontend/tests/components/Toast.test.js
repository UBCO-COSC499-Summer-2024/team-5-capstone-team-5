// app/frontend/tests/components/Toast.test.js

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Toast from '@components/Toast';

describe('Toast', () => {
  const onCloseMock = jest.fn();
  const onConfirmMock = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders Toast component with message and type', () => {
    render(
      <Toast
        message="Test Message"
        type="error"
        onClose={onCloseMock}
        onConfirm={onConfirmMock}
        showConfirm={false}
      />
    );

    expect(screen.getByText('Test Message')).toBeInTheDocument();
    expect(screen.getByText('×')).toBeInTheDocument();
    expect(screen.getByText('Test Message').parentElement.parentElement).toHaveClass('bg-red-500');
  });

  test('calls onClose after 3 seconds if showConfirm is false', () => {
    jest.useFakeTimers();

    render(
      <Toast
        message="Test Message"
        type="success"
        onClose={onCloseMock}
        onConfirm={onConfirmMock}
        showConfirm={false}
      />
    );

    jest.advanceTimersByTime(3000);

    expect(onCloseMock).toHaveBeenCalledTimes(1);

    jest.useRealTimers();
  });

  test('does not call onClose automatically if showConfirm is true', () => {
    jest.useFakeTimers();

    render(
      <Toast
        message="Test Message"
        type="success"
        onClose={onCloseMock}
        onConfirm={onConfirmMock}
        showConfirm={true}
      />
    );

    jest.advanceTimersByTime(3000);

    expect(onCloseMock).not.toHaveBeenCalled();

    jest.useRealTimers();
  });

  test('renders confirm and cancel buttons when showConfirm is true', () => {
    render(
      <Toast
        message="Test Message"
        type="error"
        onClose={onCloseMock}
        onConfirm={onConfirmMock}
        showConfirm={true}
      />
    );

    expect(screen.getByText('Confirm Delete')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  test('calls onConfirm when confirm button is clicked', () => {
    render(
      <Toast
        message="Test Message"
        type="error"
        onClose={onCloseMock}
        onConfirm={onConfirmMock}
        showConfirm={true}
      />
    );

    fireEvent.click(screen.getByText('Confirm Delete'));

    expect(onConfirmMock).toHaveBeenCalledTimes(1);
  });

  test('calls onClose when cancel button is clicked', () => {
    render(
      <Toast
        message="Test Message"
        type="error"
        onClose={onCloseMock}
        onConfirm={onConfirmMock}
        showConfirm={true}
      />
    );

    fireEvent.click(screen.getByText('Cancel'));

    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  test('calls onClose when close button is clicked if showConfirm is false', () => {
    render(
      <Toast
        message="Test Message"
        type="error"
        onClose={onCloseMock}
        onConfirm={onConfirmMock}
        showConfirm={false}
      />
    );

    fireEvent.click(screen.getByText('×'));

    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });
});
