import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import YearByYearStats from '@components/Instructor/YearByYearStats';
import { useTheme } from '@src/App';
import '@testing-library/jest-dom';

jest.mock('@src/App', () => ({
  useTheme: jest.fn(),
}));

const mockSetAsPercents = jest.fn();
const mockHandleYearByYearClose = jest.fn();
const mockYearByYearInfo = {
  show: true,
  yearByYearGrades: [
    {
      gradeList: [
        {
          examId: 1,
          studentScore: 85,
        },
        {
          examId: 2,
          studentScore: 75,
        },
      ],
      startDate: '2024-01-01',
      section: '001',
      mean: 80,
      stdev: 7.071,
      min: 75,
      q1: 75,
      median: 80,
      q3: 85,
      max: 85,
      count: 2,
    },
  ],
  department: 'Math',
  code: 'MATH101',
  name: 'Calculus',
};

const renderComponent = (props = {}) => {
  return render(
    <YearByYearStats
      yearByYearInfo={mockYearByYearInfo}
      asPercents={false}
      setAsPercents={mockSetAsPercents}
      handleYearByYearClose={mockHandleYearByYearClose}
      {...props}
    />
  );
};

describe('YearByYearStats', () => {
  beforeEach(() => {
    useTheme.mockReturnValue({ theme: 'light' });
  });

  test('renders component correctly when show is true', () => {
    renderComponent();

    expect(screen.getByText(/viewing previous statistics for Math-MATH101: Calculus/i)).toBeInTheDocument();
    expect(screen.getByText(/course start date/i)).toBeInTheDocument();
    expect(screen.getByText(/2024-01-01/i)).toBeInTheDocument();
    expect(screen.getByText(/001/i)).toBeInTheDocument();
    expect(screen.getByText(/7.071/i)).toBeInTheDocument();
    expect(screen.getAllByText(/75/i)).toHaveLength(2);
    expect(screen.getAllByText(/85/i)).toHaveLength(2);
  });

  test('toggles percent view when button is clicked', () => {
    renderComponent();

    fireEvent.click(screen.getByText(/toggle percents/i));
    expect(mockSetAsPercents).toHaveBeenCalledWith(true);
  });

  test('calls close handler when close button is clicked', () => {
    renderComponent();

    fireEvent.click(screen.getByText(/close/i));
    expect(mockHandleYearByYearClose).toHaveBeenCalled();
  });
});
