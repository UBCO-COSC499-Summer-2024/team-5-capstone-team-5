// tests/components/Instructor/StudentList.test.jsx

import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import StudentList from '../../../src/components/Instructor/StudentList';
import { useTheme } from '../../../src/App';
import getStudentData from '../../../src/hooks/getStudentData';
import StudentSpreadsheet from '../../../src/components/Instructor/StudentSpreadsheet';

jest.mock('../../../src/App', () => ({
  useTheme: jest.fn(),
}));

jest.mock('../../../src/hooks/getStudentData', () => jest.fn());
jest.mock('../../../src/components/Instructor/StudentSpreadsheet', () => jest.fn(() => <div data-testid="StudentSpreadsheet"></div>));

const mockFetch = (url, options) => {
  if (url === 'http://localhost/api/users/upload') {
    return options.method === 'POST'
      ? Promise.resolve({ ok: true })
      : Promise.resolve({ ok: false, statusText: 'Bad Request' });
  }
  return Promise.resolve({
    json: () => Promise.resolve([{ role: 1, first_name: 'John', last_name: 'Doe' }, { role: 2, first_name: 'Jane', last_name: 'Smith' }]),
  });
};

global.fetch = jest.fn().mockImplementation((url, options) => mockFetch(url, options));

describe('StudentList', () => {
  beforeEach(() => {
    useTheme.mockReturnValue({ theme: 'light', toggleTheme: jest.fn() });
    getStudentData.mockReturnValue(Promise.resolve([{ role: 1, first_name: 'John', last_name: 'Doe' }, { role: 2, first_name: 'Jane', last_name: 'Smith' }]));
  });

  const renderComponent = (props) => {
    render(<StudentList {...props} />);
  };

  test('renders correctly when data is loaded', async () => {
    await act(async () => {
      renderComponent({ courseId: 'course123', courseName: 'Sample Course', asPercents: false, setAsPercents: jest.fn() });
    });

    await waitFor(() => {
      expect(screen.getByText(/Instructor: Jane Smith/)).toBeInTheDocument();
      expect(screen.getByText(/Enroll Students into Course/)).toBeInTheDocument();
      expect(screen.getByTestId('StudentSpreadsheet')).toBeInTheDocument();
    });
  });

  test('toggles percents', async () => {
    const setAsPercents = jest.fn();

    await act(async () => {
      renderComponent({ courseId: 'course123', courseName: 'Sample Course', asPercents: false, setAsPercents });
    });

    await waitFor(() => {
      expect(screen.getByText(/Toggle percents/)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/Toggle percents/));

    expect(setAsPercents).toHaveBeenCalledWith(true);
  });
});
