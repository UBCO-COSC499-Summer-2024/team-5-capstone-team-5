// app/frontend/tests/components/CourseDetails.test.js

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom';
import CourseDetails from '../../../src/components/CourseDetails';
import getTestData from '../../../src/hooks/getTestData';

// Mock the useParams hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ courseId: '123' }),
}));

// Mock the getTestData hook
jest.mock('../../../src/hooks/getTestData', () => jest.fn());

describe('CourseDetails Component', () => {
  const mockTestData = [
    { id: 1, name: 'Test 1', course_name: 'Sample Course' },
    { id: 2, name: 'Test 2', course_name: 'Sample Course' },
  ];

  beforeEach(() => {
    getTestData.mockResolvedValue(mockTestData);
  });

  it('renders without crashing and displays the course name and tests', async () => {
    render(
      <BrowserRouter>
        <CourseDetails />
      </BrowserRouter>
    );

    // Check if the loading text is rendered initially
    expect(screen.getByText('Loading')).toBeInTheDocument();

    // Wait for the test data to be fetched and displayed
    await waitFor(() => {
      // Check if the course name is rendered
      expect(screen.getByText('Sample Course')).toBeInTheDocument();

      // Check if the tests are rendered
      mockTestData.forEach((test) => {
        expect(screen.getByText(test.name)).toBeInTheDocument();
      });
    });
  });
});
