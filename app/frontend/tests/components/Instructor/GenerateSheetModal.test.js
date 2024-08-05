// app/frontend/tests/components/Instructor/GenerateSheetModal.test.js

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';
import GenerateSheetModal from '@components/Instructor/GenerateSheetModal';
import { useTheme } from '@src/App';
import { useNavigate } from 'react-router-dom';

// Mocking the useTheme hook
jest.mock('@src/App', () => ({
  useTheme: jest.fn(),
}));

// Mocking the useNavigate hook
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

describe('GenerateSheetModal Component', () => {
  const mockNavigate = jest.fn();
  const mockOnClose = jest.fn();

  beforeEach(() => {
    useTheme.mockReturnValue({ theme: 'light' });
    useNavigate.mockReturnValue(mockNavigate);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders the modal when showModal is true', () => {
    render(
      <Router>
        <GenerateSheetModal showModal={true} onClose={mockOnClose} />
      </Router>
    );

    expect(screen.getByText('Select Sheet Type')).toBeInTheDocument();
    expect(screen.getByText('100 Bubble Sheet')).toBeInTheDocument();
    expect(screen.getByText('200 Bubble Sheet')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  test('does not render the modal when showModal is false', () => {
    render(
      <Router>
        <GenerateSheetModal showModal={false} onClose={mockOnClose} />
      </Router>
    );

    expect(screen.queryByText('Select Sheet Type')).not.toBeInTheDocument();
  });

  test('navigates to the correct route and closes the modal on button click', () => {
    render(
      <Router>
        <GenerateSheetModal showModal={true} onClose={mockOnClose} />
      </Router>
    );

    fireEvent.click(screen.getByText('100 Bubble Sheet'));
    expect(mockNavigate).toHaveBeenCalledWith('/instructor/omr-sheet-generator/100');
    expect(mockOnClose).toHaveBeenCalled();

    fireEvent.click(screen.getByText('200 Bubble Sheet'));
    expect(mockNavigate).toHaveBeenCalledWith('/instructor/omr-sheet-generator/200');
    expect(mockOnClose).toHaveBeenCalled();

    fireEvent.click(screen.getByText('Cancel'));
    expect(mockOnClose).toHaveBeenCalled();
  });
});
