// app/frontend/tests/components/Instructor/MenuBar.test.js

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import MenuBar from '../../../src/components/Instructor/MenuBar';
import { useTheme } from '../../../src/App';

// Mock the useTheme hook
jest.mock('../../../src/App', () => ({
  useTheme: jest.fn(),
}));

describe('MenuBar Component', () => {
  const mockSetSelectedMenu = jest.fn();

  beforeEach(() => {
    // Mock the return value of useTheme
    useTheme.mockReturnValue({ theme: 'light' });
  });

  it('renders without crashing and displays navigation items', () => {
    render(<MenuBar selectedMenu="tests" setSelectedMenu={mockSetSelectedMenu} />);

    // Check if the navigation items are rendered
    expect(screen.getByText('Tests')).toBeInTheDocument();
    expect(screen.getByText('Students')).toBeInTheDocument();
  });

  it('calls setSelectedMenu with the correct argument when a button is clicked', () => {
    render(<MenuBar selectedMenu="tests" setSelectedMenu={mockSetSelectedMenu} />);

    // Click on the "Students" button
    fireEvent.click(screen.getByText('Students'));

    // Check if setSelectedMenu was called with the correct argument
    expect(mockSetSelectedMenu).toHaveBeenCalledWith('students');
  });

  it('applies the correct class based on the selected menu and theme', () => {
    const { rerender } = render(<MenuBar selectedMenu="tests" setSelectedMenu={mockSetSelectedMenu} />);

    // Check the class of the "Tests" button when selected
    expect(screen.getByText('Tests')).toHaveClass('bg-gray-400 text-black');

    // Change theme to dark
    useTheme.mockReturnValue({ theme: 'dark' });
    rerender(<MenuBar selectedMenu="tests" setSelectedMenu={mockSetSelectedMenu} />);

    // Check the class of the "Tests" button when selected and theme is dark
    expect(screen.getByText('Tests')).toHaveClass('bg-gray-900 text-white');
  });
});
