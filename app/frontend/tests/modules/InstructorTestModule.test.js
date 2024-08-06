import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import InstructorTest from '@components/Modules/InstructorTestModule';
import { useTheme } from '@src/App';
import { mean, stdev, fiveNumSummary } from '@components/Instructor/stats';

jest.mock('@src/App', () => ({
  useTheme: jest.fn(),
}));

jest.mock('@components/Instructor/stats', () => ({
  mean: jest.fn(),
  stdev: jest.fn(),
  fiveNumSummary: jest.fn(),
}));

describe('InstructorTestModule', () => {
  const mockSetState = jest.fn();
  const mockTest = {
    id: 1,
    name: 'Sample Test',
  };
  const mockParsedGrades = {
    grades: [
      {
        scores: [
          { examId: 1, studentScore: 90, maxScore: 100 },
          { examId: 2, studentScore: 80, maxScore: 100 },
        ],
      },
      {
        scores: [
          { examId: 1, studentScore: 85, maxScore: 100 },
          { examId: 2, studentScore: 75, maxScore: 100 },
        ],
      },
    ],
  };
  const mockTheme = 'light';
  const mockMean = 87.5;
  const mockStdev = 2.5;
  const mockFiveNumSummary = [85, 87, 87.5, 88, 90];

  const renderComponent = (props = {}) => {
    return render(
      <table>
        <tbody>
          <InstructorTest
            setState={mockSetState}
            test={mockTest}
            parsedGrades={mockParsedGrades}
            asPercents={false}
            {...props}
          />
        </tbody>
      </table>
    );
  };

  beforeEach(() => {
    useTheme.mockReturnValue({ theme: mockTheme });
    mean.mockReturnValue(mockMean);
    stdev.mockReturnValue(mockStdev);
    fiveNumSummary.mockReturnValue(mockFiveNumSummary);
  });

  test('renders test details correctly', () => {
    renderComponent();

    expect(screen.getByText(/sample test/i)).toBeInTheDocument();
    expect(screen.getByText(mockMean.toFixed(3))).toBeInTheDocument();
    expect(screen.getByText(mockStdev.toFixed(3))).toBeInTheDocument();
    expect(screen.getByText(mockFiveNumSummary[0])).toBeInTheDocument();
    expect(screen.getByText(mockFiveNumSummary[1])).toBeInTheDocument();
    expect(screen.getByText(mockFiveNumSummary[2])).toBeInTheDocument();
    expect(screen.getByText(mockFiveNumSummary[3])).toBeInTheDocument();
    expect(screen.getByText(mockFiveNumSummary[4])).toBeInTheDocument();
    expect(screen.getByText(mockParsedGrades.grades.length)).toBeInTheDocument();
  });

  test('handles click event correctly', () => {
    renderComponent();

    const row = screen.getByText(/sample test/i).closest('tr');
    fireEvent.click(row);
    expect(mockSetState).toHaveBeenCalledWith(mockTest);
  });

  test('displays percentage symbols when asPercents is true', () => {
    renderComponent({ asPercents: true });

    expect(screen.getByText(`${mockMean.toFixed(3)}%`)).toBeInTheDocument();
    expect(screen.getByText(`${mockStdev.toFixed(3)}%`)).toBeInTheDocument();
    expect(screen.getByText(`${mockFiveNumSummary[0]}%`)).toBeInTheDocument();
    expect(screen.getByText(`${mockFiveNumSummary[1]}%`)).toBeInTheDocument();
    expect(screen.getByText(`${mockFiveNumSummary[2]}%`)).toBeInTheDocument();
    expect(screen.getByText(`${mockFiveNumSummary[3]}%`)).toBeInTheDocument();
    expect(screen.getByText(`${mockFiveNumSummary[4]}%`)).toBeInTheDocument();
  });

  test('displays "-" for missing data', () => {
    render(
      <table>
        <tbody>
          <InstructorTest
            setState={mockSetState}
            test={mockTest}
            parsedGrades={null}
            asPercents={false}
          />
        </tbody>
      </table>
    );

    const dashElements = screen.getAllByText('-');
    expect(dashElements).toHaveLength(7); 
  });
});
