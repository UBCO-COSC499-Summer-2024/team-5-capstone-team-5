// app/frontend/tests/components/Instructor/InstructorCourseDetails.test.js

import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom';
import InstructorCourseDetails from '../../../src/components/Instructor/InstructorCourseDetails';
import { useTheme } from '../../../src/App';
import getTestData from '../../../src/hooks/getTestData';

// Mock the necessary modules
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ courseId: '123' }),
  useNavigate: () => jest.fn(),
}));

jest.mock('../../../src/hooks/getTestData', () => jest.fn());
jest.mock('../../../src/App', () => ({
  useTheme: jest.fn(),
}));

const mockTestData = [
  { id: 1, name: 'Test 1', course_name: 'Course 1' },
  { id: 2, name: 'Test 2', course_name: 'Course 1' },
];

describe('InstructorCourseDetails Component', () => {
  beforeEach(() => {
    useTheme.mockReturnValue({ theme: 'light' });
    getTestData.mockResolvedValue(mockTestData);
  });

  it('renders and displays test data', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <InstructorCourseDetails />
        </BrowserRouter>
      );
    });

    await waitFor(() => {
      expect(screen.getByText('Course 1 Tests')).toBeInTheDocument();
      expect(screen.getByText('Test 1')).toBeInTheDocument();
      expect(screen.getByText('Test 2')).toBeInTheDocument();
    });
  });

  it('handles delete test correctly', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      })
    );

    await act(async () => {
      render(
        <BrowserRouter>
          <InstructorCourseDetails />
        </BrowserRouter>
      );
    });

    await waitFor(() => {
      expect(screen.getByText('Test 1')).toBeInTheDocument();
      expect(screen.getByText('Test 2')).toBeInTheDocument();
    });

    // Simulate clicking on Test 1 to select it
    fireEvent.click(screen.getByText('Test 1'));

    await waitFor(() => {
      expect(screen.getByText('Delete Test')).toBeInTheDocument();
    });

    // Click the delete button
    const deleteButton = screen.getByText('Delete Test');
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(screen.queryByText('Test 1')).not.toBeInTheDocument();
    });
  });

  it('handles edit test correctly', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      })
    );

    await act(async () => {
      render(
        <BrowserRouter>
          <InstructorCourseDetails />
        </BrowserRouter>
      );
    });

    await waitFor(() => {
      expect(screen.getByText('Test 1')).toBeInTheDocument();
    });

    // Simulate clicking on Test 1 to select it
    fireEvent.click(screen.getByText('Test 1'));

    await waitFor(() => {
      expect(screen.getByText('Edit Test')).toBeInTheDocument();
    });

    // Click the edit button
    const editButton = screen.getByText('Edit Test');
    fireEvent.click(editButton);

    // Change the test name
    const editInput = screen.getByDisplayValue('Test 1');
    fireEvent.change(editInput, { target: { value: 'Test 1 Edited' } });

    // Click the save button
    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText('Test 1 Edited')).toBeInTheDocument();
    });
  });
});
