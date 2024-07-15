import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Course from '../../src/components/Modules/CourseModule';
import '@testing-library/jest-dom/extend-expect';

test('renders Course component with test data', () => {
  const test = {
    id: 1,
    name: "Sample Test",
    date_marked: "2023-07-05T10:30:00Z"
  };

  const { getByText } = render(
    <MemoryRouter>
      <Course test={test} />
    </MemoryRouter>
  );

  expect(getByText(/Sample Test/i)).toBeInTheDocument();
  expect(getByText(/Date Marked: 2023-07-05/i)).toBeInTheDocument();
});

test('renders Course component without date_marked', () => {
  const test = {
    id: 1,
    name: "Sample Test",
    date_marked: null
  };

  const { getByText, queryByText } = render(
    <MemoryRouter>
      <Course test={test} />
    </MemoryRouter>
  );

  expect(getByText(/Sample Test/i)).toBeInTheDocument();
  expect(queryByText(/Date Marked:/i)).not.toBeInTheDocument();
});
