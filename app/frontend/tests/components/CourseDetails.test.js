// tests/components/CourseDetails.test.js
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CourseDetails from '../../src/components/CourseDetails';
import { getTestData } from '../../src/hooks/getTestData';

jest.mock('../../src/hooks/getTestData', () => ({
  getTestData: jest.fn(),
}));

describe('CourseDetails Component', () => {
  beforeEach(() => {
    getTestData.mockClear();
  });

  it('renders loading state initially', () => {
    render(
      <BrowserRouter>
        <Routes>
          <Route path="/course/:courseId" element={<CourseDetails />} />
        </Routes>
      </BrowserRouter>
    );

    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it('renders course details after loading', async () => {
    getTestData.mockResolvedValueOnce({
      name: 'Math 101',
      tests: ['Test 1', 'Test 2'],
    });

    render(
      <BrowserRouter>
        <Routes>
          <Route path="/course/:courseId" element={<CourseDetails />} />
        </Routes>
      </BrowserRouter>
    );

    await waitFor(() => expect(getTestData).toHaveBeenCalledWith('1'));

    expect(screen.getByText('Math 101')).toBeInTheDocument();
    expect(screen.getByText('Test 1')).toBeInTheDocument();
    expect(screen.getByText('Test 2')).toBeInTheDocument();
  });

  it('renders no data available when there are no tests', async () => {
    getTestData.mockResolvedValueOnce({
      name: 'Math 101',
      tests: [],
    });

    render(
      <BrowserRouter>
        <Routes>
          <Route path="/course/:courseId" element={<CourseDetails />} />
        </Routes>
      </BrowserRouter>
    );

    await waitFor(() => expect(getTestData).toHaveBeenCalledWith('1'));

    expect(screen.getByText('No Data Available')).toBeInTheDocument();
  });

  it('handles errors during data fetching', async () => {
    getTestData.mockRejectedValueOnce(new Error('Network Error'));

    render(
      <BrowserRouter>
        <Routes>
          <Route path="/course/:courseId" element={<CourseDetails />} />
        </Routes>
      </BrowserRouter>
    );

    await waitFor(() => expect(getTestData).toHaveBeenCalledWith('1'));

    expect(screen.getByText('No Data Available')).toBeInTheDocument();
  });
});
