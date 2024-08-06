import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import TestDescription from '@components/Instructor/TestDescription';
import { useTheme } from '@src/App';
import { useNavigate } from 'react-router-dom';
import getYearByYearGrades from '@src/hooks/getYearByYearGrades';
import '@testing-library/jest-dom';

jest.mock('@src/App', () => ({
  useTheme: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
  BrowserRouter: ({ children }) => <div>{children}</div>,
}));

jest.mock('@src/hooks/getYearByYearGrades', () => jest.fn());

const mockTest = {
  id: 1,
  name: 'Sample Test',
  department: 'Math',
  code: 'MATH101',
  date_marked: '2024-07-15T00:00:00Z',
  mean_score: 85,
  courseId: 1,
};

const mockOnBack = jest.fn();
const mockOnDeleteTest = jest.fn();
const mockSetAsPercents = jest.fn();

const renderComponent = (props = {}) => {
  return render(
    <BrowserRouter>
      <TestDescription
        test={mockTest}
        onBack={mockOnBack}
        onDeleteTest={mockOnDeleteTest}
        asPercents={false}
        setAsPercents={mockSetAsPercents}
        {...props}
      />
    </BrowserRouter>
  );
};

describe('TestDescription', () => {
  beforeEach(() => {
    useTheme.mockReturnValue({ theme: 'light' });
    useNavigate.mockReturnValue(jest.fn());
    getYearByYearGrades.mockResolvedValue([]);
  });

  test('renders test details correctly', () => {
    renderComponent();

    expect(screen.getByText('Sample Test')).toBeInTheDocument();
    expect(screen.getByText('Date Marked:')).toBeInTheDocument();
    expect(screen.getByText('Mean Score:')).toBeInTheDocument();
  });

  test('calls onBack when back button is clicked', () => {
    renderComponent();

    fireEvent.click(screen.getByText(/back/i));
    expect(mockOnBack).toHaveBeenCalled();
  });

  test('calls onDeleteTest when delete button is clicked', () => {
    window.confirm = jest.fn().mockImplementation(() => true); // Mock confirm dialog
    renderComponent();

    fireEvent.click(screen.getByText(/delete test/i));
    expect(mockOnDeleteTest).toHaveBeenCalledWith(1);
  });

  test('navigates to correct answers page when view correct answers button is clicked', () => {
    const navigate = useNavigate();
    renderComponent();

    fireEvent.click(screen.getByText(/view \/ edit answer key/i));
    expect(navigate).toHaveBeenCalledWith(
      `/instructor/course/${mockTest.courseId}/test/${mockTest.id}/correct-answers`,
      { state: { test: mockTest } }
    );
  });

  test('fetches year by year grades and displays them when view previous statistics button is clicked', async () => {
    renderComponent();

    fireEvent.click(screen.getByText(/view previous statistics/i));
    expect(getYearByYearGrades).toHaveBeenCalledWith(
      mockTest.department,
      mockTest.code,
      mockTest.name
    );
  });

  test('shows GenerateSheetModal when generate sheet button is clicked', () => {
    renderComponent();

    fireEvent.click(screen.getByText(/generate a sheet/i));
    expect(screen.getByText(/select sheet type/i)).toBeInTheDocument();
  });
});
