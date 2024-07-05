// app/frontend/tests/hooks/useTestResults.test.js

import { renderHook } from '@testing-library/react-hooks';
import axios from 'axios';
import useTestResults from '../../../src/hooks/useTestResults';

// Mock the axios module
jest.mock('axios');

describe('useTestResults Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches test results successfully', async () => {
    const mockTestResults = [
      { id: 1, name: 'Test 1', score: 85 },
      { id: 2, name: 'Test 2', score: 90 },
    ];

    // Mock the axios.get function to return a successful response
    axios.get.mockResolvedValueOnce({ data: mockTestResults });

    const { result, waitForNextUpdate } = renderHook(() => useTestResults('123'));

    // Wait for the hook to update
    await waitForNextUpdate();

    expect(axios.get).toHaveBeenCalledWith('/api/test-results/123');
    expect(result.current).toEqual(mockTestResults);
  });

  it('handles error during data fetching', async () => {
    const errorMessage = 'Network error';
    // Mock the axios.get function to throw an error
    axios.get.mockRejectedValueOnce(new Error(errorMessage));

    console.error = jest.fn();

    const { result, waitForNextUpdate } = renderHook(() => useTestResults('123'));

    // Wait for the hook to update
    await waitForNextUpdate();

    expect(axios.get).toHaveBeenCalledWith('/api/test-results/123');
    expect(console.error).toHaveBeenCalledWith('Error fetching test results:', new Error(errorMessage));
    expect(result.current).toBeNull();
  });
});
