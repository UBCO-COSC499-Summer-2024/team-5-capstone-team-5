// tests/components/Instructor/ScanView.test.jsx

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ScanView from '../../../src/components/Instructor/ScanView';
import { useTheme } from '../../../src/App';
import { MemoryRouter } from 'react-router-dom';
import validateUser from '../../../src/hooks/validateUser';
import getUserInfo from '../../../src/hooks/getUserInfo';
import getStudentData from '../../../src/hooks/getStudentData';
import InstResponseBubbles from '../../../src/components/BubbleSheet/InstResponsesBubble';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

jest.mock('../../../src/App', () => ({
  useTheme: jest.fn(),
}));

jest.mock('../../../src/hooks/validateUser', () => jest.fn());
jest.mock('../../../src/hooks/getUserInfo', () => jest.fn());
jest.mock('../../../src/hooks/getStudentData', () => jest.fn());

jest.mock('../../../src/components/BubbleSheet/InstResponsesBubble', () => jest.fn(() => <div data-testid="InstResponseBubbles"></div>));

const mockFetch = (url) => {
  switch (url) {
    case 'http://localhost/api/questions/answers/exam123':
      return Promise.resolve({
        json: () => Promise.resolve({ data: 'mock data' }),
      });
    case 'http://localhost/api/users/scans/exam123/student123':
      return Promise.resolve({
        json: () => Promise.resolve({ path: '/mock-path' }),
      });
    case 'HTTP://localhost/api/questions/responses/exam123&student123':
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([{ question: 'Q1', answer: 'A1' }]),
      });
    default:
      return Promise.resolve({
        json: () => Promise.resolve({}),
      });
  }
};

global.fetch = jest.fn().mockImplementation((url) => mockFetch(url));

describe('ScanView', () => {
  let navigate;

  beforeAll(() => {
    navigate = jest.fn();
    require('react-router-dom').useNavigate.mockReturnValue(navigate);
    useTheme.mockReturnValue({ theme: 'light', toggleTheme: jest.fn() });
    validateUser.mockReturnValue(Promise.resolve(true));
    getUserInfo.mockReturnValue(Promise.resolve({ name: 'John Doe', userId: 'user123' }));
  });

  const scanViewInfo = {
    isOpen: true,
    student: 'student123',
    exam: 'exam123',
    firstName: 'John',
    lastName: 'Doe',
    examName: 'Sample Exam',
    courseName: 'Sample Course',
    isRegistered: false,
  };

  const renderComponent = (props) => {
    render(
      <MemoryRouter>
        <ScanView {...props} />
      </MemoryRouter>
    );
  };

  test('renders correctly when open and has responses', async () => {
    renderComponent({ scanViewInfo });

    await waitFor(() => {
      expect(screen.getByText(/Editing grades for John Doe on Sample Exam/)).toBeInTheDocument();
      expect(screen.getByTestId('InstResponseBubbles')).toBeInTheDocument();
    });
  });

  test('handles close button click', () => {
    const onClose = jest.fn();
    renderComponent({ scanViewInfo, onClose });

    fireEvent.click(screen.getByText('Close'));
    expect(onClose).toHaveBeenCalled();
  });

  test('displays warning and handles student registration', async () => {
    const onClose = jest.fn();
    renderComponent({ scanViewInfo, onClose });

    await waitFor(() => {
      expect(screen.getByText(/is not registered in Sample Course/)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Register student'));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('HTTP://localhost/api/users/register', expect.any(Object));
      expect(onClose).toHaveBeenCalled();
    });
  });

  test('fetches and displays image', async () => {
    renderComponent({ scanViewInfo });

    await waitFor(() => {
      expect(screen.getByAltText('Scan Image')).toBeInTheDocument();
      expect(screen.getByAltText('Scan Image')).toHaveAttribute('src', 'http://localhost/mock-path');
    });
  });
});
