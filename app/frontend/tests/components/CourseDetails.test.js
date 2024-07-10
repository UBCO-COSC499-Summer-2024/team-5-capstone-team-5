// app/frontend/tests/components/CourseDetails.test.js
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import CourseDetails from '../../src/components/CourseDetails';
import { getTestData } from '../../src/hooks/getTestData';
import '@testing-library/jest-dom/extend-expect';

jest.mock('../../src/hooks/getTestData', () => ({
  getTestData: jest.fn(),
}));

const mockTests = [
  { id: 1, name: 'Math 101' },
  { id: 2, name: 'Math 102' },
];

test('renders CourseDetails component with tests', async () => {
  getTestData.mockResolvedValueOnce(mockTests);

  render(
    <BrowserRouter initialEntries={['/course/1']}>
      <Routes>
        <Route path="/course/:courseId" element={<CourseDetails />} />
      </Routes>
    </BrowserRouter>
  );

  expect(screen.getByText(/Loading/i)).toBeInTheDocument();

  await waitFor(() => expect(getTestData).toHaveBeenCalledWith('1'));

  expect(screen.getByText(/Math 101/i)).toBeInTheDocument();
  expect(screen.getByText(/Math 102/i)).toBeInTheDocument();
});

test('renders CourseDetails component with no tests', async () => {
  getTestData.mockResolvedValueOnce([]);

  render(
    <BrowserRouter initialEntries={['/course/1']}>
      <Routes>
        <Route path="/course/:courseId" element={<CourseDetails />} />
      </Routes>
    </BrowserRouter>
  );

  expect(screen.getByText(/Loading/i)).toBeInTheDocument();

  await waitFor(() => expect(getTestData).toHaveBeenCalledWith('1'));

  expect(screen.getByText(/No tests available/i)).toBeInTheDocument();
});
