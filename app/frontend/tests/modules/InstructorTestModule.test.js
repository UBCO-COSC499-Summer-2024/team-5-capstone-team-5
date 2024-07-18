// app/frontend/tests/modules/InstructorTestModule.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import InstructorTest from '../../src/components/Modules/InstructorTestModule';
import '@testing-library/jest-dom/extend-expect';

// Mock the useTheme hook
jest.mock('../../src/App', () => ({
  useTheme: jest.fn(),
}));

const mockUseTheme = require('../../src/App').useTheme;

const testData = {
  name: "Test 1",
  mean_score: 85,
};

describe('InstructorTest Component', () => {
  it('renders InstructorTest component with light theme', () => {
    mockUseTheme.mockReturnValue({ theme: 'light' });

    const setState = jest.fn();

    render(<InstructorTest setState={setState} test={testData} />);

    // Check if the test details are rendered correctly
    expect(screen.getByText(/Test 1/i)).toBeInTheDocument();
    expect(screen.getByText(/85/i)).toBeInTheDocument();

    // Check if the row has the correct light theme classes
    const row = screen.getByRole('row');
    expect(row).toHaveClass('bg-gray-300 text-black');
  });

  it('renders InstructorTest component with dark theme', () => {
    mockUseTheme.mockReturnValue({ theme: 'dark' });

    const setState = jest.fn();

    render(<InstructorTest setState={setState} test={testData} />);

    // Check if the test details are rendered correctly
    expect(screen.getByText(/Test 1/i)).toBeInTheDocument();
    expect(screen.getByText(/85/i)).toBeInTheDocument();

    // Check if the row has the correct dark theme classes
    const row = screen.getByRole('row');
    expect(row).toHaveClass('bg-gray-700 text-white');
  });

  it('calls setState with correct test data on click', () => {
    mockUseTheme.mockReturnValue({ theme: 'light' });

    const setState = jest.fn();

    render(<InstructorTest setState={setState} test={testData} />);

    // Simulate clicking the row
    const row = screen.getByRole('row');
    fireEvent.click(row);

    // Verify that setState was called with the correct test data
    expect(setState).toHaveBeenCalledWith(testData);
  });
});
