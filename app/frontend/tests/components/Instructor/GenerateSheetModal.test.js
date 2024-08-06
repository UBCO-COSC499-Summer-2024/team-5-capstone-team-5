// app/frontend/tests/components/Instructor/GenerateSheetModal.test.js

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { useNavigate } from 'react-router-dom';
import GenerateSheetModal from '../../../src/components/Instructor/GenerateSheetModal';
import { useTheme } from '../../../src/App';

jest.mock('../../../src/App', () => ({
  useTheme: jest.fn()
}));

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn()
}));

describe('GenerateSheetModal', () => {
  const onClose = jest.fn();
  const navigate = jest.fn();

  beforeEach(() => {
    useTheme.mockReturnValue({ theme: 'light' });
    useNavigate.mockReturnValue(navigate);
    jest.clearAllMocks();
  });

  test('renders GenerateSheetModal correctly when showModal is true', () => {
    render(<GenerateSheetModal showModal={true} onClose={onClose} />);

    expect(screen.getByText('Select Sheet Type')).toBeInTheDocument();
    expect(screen.getByText('100 Bubble Sheet')).toBeInTheDocument();
    expect(screen.getByText('200 Bubble Sheet')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  test('does not render GenerateSheetModal when showModal is false', () => {
    render(<GenerateSheetModal showModal={false} onClose={onClose} />);

    expect(screen.queryByText('Select Sheet Type')).not.toBeInTheDocument();
  });

  test('calls handleGenerateSheet with correct type and navigates when 100 Bubble Sheet is clicked', () => {
    render(<GenerateSheetModal showModal={true} onClose={onClose} />);

    fireEvent.click(screen.getByText('100 Bubble Sheet'));

    expect(navigate).toHaveBeenCalledWith('/instructor/omr-sheet-generator/100');
    expect(onClose).toHaveBeenCalled();
  });

  test('calls handleGenerateSheet with correct type and navigates when 200 Bubble Sheet is clicked', () => {
    render(<GenerateSheetModal showModal={true} onClose={onClose} />);

    fireEvent.click(screen.getByText('200 Bubble Sheet'));

    expect(navigate).toHaveBeenCalledWith('/instructor/omr-sheet-generator/200');
    expect(onClose).toHaveBeenCalled();
  });

  test('calls onClose when Cancel button is clicked', () => {
    render(<GenerateSheetModal showModal={true} onClose={onClose} />);

    fireEvent.click(screen.getByText('Cancel'));

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
