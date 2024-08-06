import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Course from '@components/Modules/CourseModule';
import '@testing-library/jest-dom';

const renderComponent = (props = {}) => {
  return render(
    <BrowserRouter>
      <Course {...props} />
    </BrowserRouter>
  );
};

describe('CourseModule', () => {
  const mockTest = {
    id: 1,
    name: 'Sample Test',
    date_marked: '2024-08-05T00:00:00.000Z',
  };

  test('renders course name correctly', () => {
    renderComponent({ test: mockTest });

    expect(screen.getByText(/sample test/i)).toBeInTheDocument();
  });

  test('renders date marked correctly', () => {
    renderComponent({ test: mockTest });

    expect(screen.getByText(/date marked: 2024-08-05/i)).toBeInTheDocument();
  });

  test('renders NavLink with correct href', () => {
    renderComponent({ test: mockTest });

    const navLink = screen.getByRole('link', { name: /sample test/i });
    expect(navLink).toHaveAttribute('href', '/student/exam/1');
  });
});
