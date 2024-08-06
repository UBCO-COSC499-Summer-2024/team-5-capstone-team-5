// tests/components/Instructor/MenuBar.test.js

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import MenuBar from '../../../src/components/Instructor/MenuBar';
import { useTheme } from '../../../src/App';

jest.mock('../../../src/App', () => ({
  useTheme: jest.fn(),
}));

describe('MenuBar', () => {
  const mockSetSelectedMenu = jest.fn();

  beforeEach(() => {
    useTheme.mockReturnValue({ theme: 'light' });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = (selectedMenu = 'tests') => {
    render(<MenuBar selectedMenu={selectedMenu} setSelectedMenu={mockSetSelectedMenu} />);
  };

  test('renders correctly with light theme', () => {
    renderComponent();

    expect(screen.getByText(/Tests/i)).toBeInTheDocument();
    expect(screen.getByText(/Students/i)).toBeInTheDocument();
  });

  test('renders correctly with dark theme', () => {
    useTheme.mockReturnValue({ theme: 'dark' });
    renderComponent();

    expect(screen.getByText(/Tests/i)).toBeInTheDocument();
    expect(screen.getByText(/Students/i)).toBeInTheDocument();
  });

  test('calls setSelectedMenu when a menu item is clicked', () => {
    renderComponent();

    fireEvent.click(screen.getByText(/Students/i));
    expect(mockSetSelectedMenu).toHaveBeenCalledWith('students');
  });

  test('applies correct class names based on theme and selected menu', () => {
    const { rerender } = render(<MenuBar selectedMenu="tests" setSelectedMenu={mockSetSelectedMenu} />);
    
    expect(screen.getByText(/Tests/i)).toHaveClass('bg-gray-400 text-black');
    expect(screen.getByText(/Students/i)).toHaveClass('text-gray-800 hover:bg-gray-500 hover:text-black');

    useTheme.mockReturnValue({ theme: 'dark' });
    rerender(<MenuBar selectedMenu="students" setSelectedMenu={mockSetSelectedMenu} />);

    expect(screen.getByText(/Tests/i)).toHaveClass('text-gray-300 hover:bg-gray-700 hover:text-white');
    expect(screen.getByText(/Students/i)).toHaveClass('bg-gray-900 text-white');
  });
});
