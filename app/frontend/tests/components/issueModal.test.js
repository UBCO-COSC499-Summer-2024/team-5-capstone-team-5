// app/frontend/tests/components/issueModal.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Modal from '@components/issueModal';
import { useTheme } from '@app/App';

jest.mock('@app/App', () => ({
  useTheme: jest.fn(),
}));

describe('Modal', () => {
  const mockHandleClose = jest.fn();
  const mockHandleSubmit = jest.fn((e) => e.preventDefault());
  const mockSetIssue = jest.fn();
  const mockIssue = 'This is a test issue';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = (theme = 'light', show = true) => {
    useTheme.mockReturnValue({ theme });
    return render(
      <Modal
        show={show}
        handleClose={mockHandleClose}
        handleSubmit={mockHandleSubmit}
        issue={mockIssue}
        setIssue={mockSetIssue}
      />
    );
  };

  test('renders Modal component with light theme', () => {
    renderComponent('light', true);

    expect(screen.getByText('Flag Question')).toBeInTheDocument();
    expect(screen.getByText('(Your instructor will see this message)')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter the issue concisely (ex. I selected A but it says I selected B)')).toHaveValue(mockIssue);

    expect(screen.getByText('Cancel')).toHaveClass('bg-gray-300 text-black hover:bg-gray-400');
    expect(screen.getByText('Submit')).toHaveClass('bg-blue-300 text-black hover:bg-blue-400');
  });

  test('renders Modal component with dark theme', () => {
    renderComponent('dark', true);

    expect(screen.getByText('Flag Question')).toBeInTheDocument();
    expect(screen.getByText('(Your instructor will see this message)')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter the issue concisely (ex. I selected A but it says I selected B)')).toHaveValue(mockIssue);

    expect(screen.getByText('Cancel')).toHaveClass('bg-gray-500 text-white hover:bg-gray-600');
    expect(screen.getByText('Submit')).toHaveClass('bg-blue-500 text-white hover:bg-blue-600');
  });

  test('does not render Modal component when show is false', () => {
    renderComponent('light', false);

    expect(screen.queryByText('Flag Question')).not.toBeInTheDocument();
  });

  test('calls handleClose when Cancel button is clicked', () => {
    renderComponent('light', true);

    fireEvent.click(screen.getByText('Cancel'));
    expect(mockHandleClose).toHaveBeenCalled();
  });

  test('calls handleSubmit when Submit button is clicked', () => {
    renderComponent('light', true);

    fireEvent.click(screen.getByText('Submit'));
    expect(mockHandleSubmit).toHaveBeenCalled();
  });

  test('calls setIssue when textarea value changes', () => {
    renderComponent('light', true);

    fireEvent.change(screen.getByPlaceholderText('Enter the issue concisely (ex. I selected A but it says I selected B)'), { target: { value: 'New issue' } });
    expect(mockSetIssue).toHaveBeenCalledWith('New issue');
  });
});
