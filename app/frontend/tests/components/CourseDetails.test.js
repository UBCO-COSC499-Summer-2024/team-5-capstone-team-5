// app/frontend/tests/components/CourseDetails.test.js

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CourseDetails from '../../components/CourseDetails';
import { useParams } from 'react-router-dom';
import getTestData from '../../hooks/getTestData';
import getGrades from '../../hooks/getGrades';
import ParseStudentGrades from '../../components/Instructor/ParseStudentGrades';
import StudentTest from '../../components/Modules/CourseModule';
import { useTheme } from '../../App'; // Correct path to useTheme

jest.mock('react-router-dom', () => ({
  useParams: jest.fn(),
}));

jest.mock('../../App', () => ({
  useTheme: jest.fn(),
}));

jest.mock('../../hooks/getTestData');
jest.mock('../../hooks/getGrades');
jest.mock('../../components/Instructor/ParseStudentGrades');
jest.mock('../../components/Modules/CourseModule', () => () => <div>Mocked StudentTest</div>);

describe('CourseDetails', () => {
  const mockCourseId = 'course123';
  const mockTests = [
    {
      id: 1,
      department: 'Math',
      code: '101',
      section: '001',
      visibility: true,
    },
  ];
  const mockGrades = 'mockGradesData';
  const mockParsedGrades = 'mockParsedGrades';

  beforeEach(() => {
    useParams.mockReturnValue({ courseId: mockCourseId });
    useTheme.mockReturnValue({ theme: 'light' });
    getTestData.mockResolvedValue(mockTests);
    getGrades.mockResolvedValue(mockGrades);
    ParseStudentGrades.mockReturnValue(mockParsedGrades);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () => render(<CourseDetails />);

  test('fetches and displays test data', async () => {
    renderComponent();

    await waitFor(() => {
      expect(getTestData).toHaveBeenCalledWith(mockCourseId);
      expect(getGrades).toHaveBeenCalledWith(mockCourseId);
    });

    expect(screen.getByText('Math 101-001 Tests')).toBeInTheDocument();
    expect(screen.getByText('Mocked StudentTest')).toBeInTheDocument();
  });

  test('displays loading state initially', () => {
    renderComponent();
    expect(screen.getByText('Loading')).toBeInTheDocument();
  });

  test('renders correctly with light theme', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByTestId('course-details-container')).toHaveClass('bg-white');
      expect(screen.getByTestId('course-details-container')).toHaveClass('text-black');
    });
  });

  test('renders correctly with dark theme', async () => {
    useTheme.mockReturnValue({ theme: 'dark' });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByTestId('course-details-container')).toHaveClass('bg-black');
      expect(screen.getByTestId('course-details-container')).toHaveClass('text-white');
    });
  });
});
