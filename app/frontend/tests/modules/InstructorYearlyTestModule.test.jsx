// app/frontend/tests/components/InstructorYearlyTestModule.test.js

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import InstructorYearlyTest from '@components/Modules/InstructorYearlyTestModule';
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

describe('InstructorYearlyTestModule', () => {
  const mockTheme = 'light';
  const mockGrades = {
    gradeList: [
      { examId: 1, studentScore: 90, maxScore: 100 },
      { examId: 2, studentScore: 80, maxScore: 100 },
    ],
    startDate: '2024-01-01',
    section: '001',
  };
  const mockMean = 85;
  const mockStdev = 5;
  const mockFiveNumSummary = [80, 82.5, 85, 87.5, 90];

  beforeEach(() => {
    useTheme.mockReturnValue({ theme: mockTheme });
    mean.mockReturnValue(mockMean);
    stdev.mockReturnValue(mockStdev);
    fiveNumSummary.mockReturnValue(mockFiveNumSummary);
  });

  const renderComponent = (props = {}) => {
    return render(<table><tbody><InstructorYearlyTest grades={mockGrades} asPercents={false} {...props} /></tbody></table>);
  };

  test('renders component correctly with provided data', () => {
    renderComponent();

    expect(screen.getByText('2024-01-01')).toBeInTheDocument();
    expect(screen.getByText('001')).toBeInTheDocument();
    expect(screen.getByText(mockMean.toFixed(3))).toBeInTheDocument();
    expect(screen.getByText(mockStdev.toFixed(3))).toBeInTheDocument();
    expect(screen.getByText(mockFiveNumSummary[0].toString())).toBeInTheDocument();
    expect(screen.getByText(mockFiveNumSummary[1].toString())).toBeInTheDocument();
    expect(screen.getByText(mockFiveNumSummary[2].toString())).toBeInTheDocument();
    expect(screen.getByText(mockFiveNumSummary[3].toString())).toBeInTheDocument();
    expect(screen.getByText(mockFiveNumSummary[4].toString())).toBeInTheDocument();
    expect(screen.getByText(mockGrades.gradeList.length.toString())).toBeInTheDocument();
  });

  test('renders percentage symbols when asPercents is true', () => {
    renderComponent({ asPercents: true });

    expect(screen.getByText('85.000%')).toBeInTheDocument();
    expect(screen.getByText('5.000%')).toBeInTheDocument();
    expect(screen.getByText('80%')).toBeInTheDocument();
    expect(screen.getByText('82.5%')).toBeInTheDocument();
    expect(screen.getByText('85%')).toBeInTheDocument();
    expect(screen.getByText('87.5%')).toBeInTheDocument();
    expect(screen.getByText('90%')).toBeInTheDocument();
  });

  test('renders "-" for missing data', () => {
    const mockEmptyGrades = {
      gradeList: "noExams",
      startDate: '2024-01-01',
      section: '001',
    };

    render(<table><tbody><InstructorYearlyTest grades={mockEmptyGrades} asPercents={false} /></tbody></table>);

    const dashElements = screen.getAllByText('-');
    expect(dashElements).toHaveLength(7); // 7 dashes for mean, stdev, min, Q1, median, Q3, max
  });
});
