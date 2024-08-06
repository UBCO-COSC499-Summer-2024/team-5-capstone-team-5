// tests/components/Instructor/InstructorCourseDetails.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import InstructorCourseDetails from '../../../src/components/Instructor/InstructorCourseDetails';
import * as getTestData from '../../../src/hooks/getTestData';
import * as getCourseInfo from '../../../src/hooks/getCourseInfo';
import * as getGrades from '../../../src/hooks/getGrades';

// Mock hooks
jest.mock('../../../src/hooks/getTestData');
jest.mock('../../../src/hooks/getCourseInfo');
jest.mock('../../../src/hooks/getGrades');
jest.mock('../../../src/App', () => ({
  useTheme: () => ({
    theme: 'light',
  }),
}));

const mockCourseId = '1';
const mockTests = [
  {
    id: 'test1',
    name: 'Test 1',
  },
];
const mockCourseInfo = {
  department: 'COMP',
  code: '100',
  section: '1',
};
const mockGrades = [];
const mockStudents = [
  { id: '1', first_name: 'John', last_name: 'Doe', role: 2 },
  { id: '2', first_name: 'Jane', last_name: 'Smith', role: 1 },
];

// Mock implementation for getStudentData
jest.mock('../../../src/hooks/getStudentData', () => jest.fn(() => Promise.resolve(mockStudents)));

// Mock fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  })
);

describe('InstructorCourseDetails', () => {
  beforeEach(() => {
    getTestData.default.mockResolvedValue(mockTests);
    getCourseInfo.default.mockResolvedValue(mockCourseInfo);
    getGrades.default.mockResolvedValue(mockGrades);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () =>
    render(
      <MemoryRouter initialEntries={[`/instructor/course/${mockCourseId}`]}>
        <Routes>
          <Route path="/instructor/course/:courseId" element={<InstructorCourseDetails />} />
        </Routes>
      </MemoryRouter>
    );

  test('renders without crashing and fetches data', async () => {
    renderComponent();

    expect(await screen.findByText(/COMP 100-001/i)).toBeInTheDocument();
    expect(screen.getByText(/Test 1/i)).toBeInTheDocument();
  });

  test('opens AddTestModal when add test button is clicked', async () => {
    renderComponent();

    fireEvent.click(screen.getByTitle('Add Test'));
    expect(await screen.findByText(/Add New Test/i)).toBeInTheDocument();
  });
});
