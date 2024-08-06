// tests/components/Instructor/OMRSheetGenerator.test.js

import React from 'react';
import { render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; // Ensure this is imported
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import OMRSheetGenerator from '../../../src/components/Instructor/OMRSheetGenerator';
import { saveAs } from 'file-saver';
import { act } from 'react-dom/test-utils';

jest.mock('file-saver', () => ({
  saveAs: jest.fn(),
}));

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: jest.fn(),
  };
});

describe('OMRSheetGenerator', () => {
  let navigate;

  beforeEach(() => {
    navigate = jest.fn();
    require('react-router-dom').useNavigate.mockReturnValue(navigate);
    jest.clearAllMocks();
  });

  test('downloads the correct file and navigates back after 3 seconds for type 100', async () => {
    const { getByText } = render(
      <MemoryRouter initialEntries={['/generate-omr/100']}>
        <Routes>
          <Route path="/generate-omr/:type" element={<OMRSheetGenerator />} />
        </Routes>
      </MemoryRouter>
    );

    expect(getByText('Your file is downloaded. You will be redirected shortly...')).toBeInTheDocument();

    expect(saveAs).toHaveBeenCalledWith(expect.stringContaining('/100bubble.pdf'), '100bubble.pdf');

    await act(() => new Promise((resolve) => setTimeout(resolve, 3000))); // wait for the timeout

    expect(navigate).toHaveBeenCalledWith(-1);
  });

  test('downloads the correct file and navigates back after 3 seconds for type 200', async () => {
    const { getByText } = render(
      <MemoryRouter initialEntries={['/generate-omr/200']}>
        <Routes>
          <Route path="/generate-omr/:type" element={<OMRSheetGenerator />} />
        </Routes>
      </MemoryRouter>
    );

    expect(getByText('Your file is downloaded. You will be redirected shortly...')).toBeInTheDocument();

    expect(saveAs).toHaveBeenCalledWith(expect.stringContaining('/200bubble.pdf'), '200bubble.pdf');

    await act(() => new Promise((resolve) => setTimeout(resolve, 3000))); // wait for the timeout

    expect(navigate).toHaveBeenCalledWith(-1);
  });
});
