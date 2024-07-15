// app/frontend/tests/hooks/useTestResults.test.js

import { renderHook, waitFor } from '@testing-library/react';
import axios from 'axios';
import useTestResults from 'hooks/useTestResults';

jest.mock('axios');

describe('useTestResults', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('fetches and returns test results', async () => {
    const mockData = {
      data: {
        id: 1,
        name: 'Test Result 1',
        score: 95,
      },
    };

    axios.get.mockResolvedValue(mockData);

    const { result } = renderHook(() => useTestResults(1));

    await waitFor(() => {
      expect(result.current).toEqual(mockData.data);
    });

    expect(axios.get).toHaveBeenCalledWith('/api/test-results/1');
  });

  it('handles errors during fetch', async () => {
    const mockError = new Error('Error fetching test results');
    axios.get.mockRejectedValue(mockError);

    const { result } = renderHook(() => useTestResults(1));

    await waitFor(() => {
      expect(result.current).toBeNull();
    });

    expect(axios.get).toHaveBeenCalledWith('/api/test-results/1');
  });
});
