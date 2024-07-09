// app/frontend/tests/hooks/getUserInfo.test.js

import React, { useEffect } from 'react';
import { render, waitFor } from '@testing-library/react';
import useTestResults from 'hooks/useTestResults';
import axios from 'axios';

jest.mock('axios');

const mockData = { data: [{ id: 1, result: 'A' }, { id: 2, result: 'B' }] };

const HookWrapper = ({ id }) => {
  const result = useTestResults(id);
  useEffect(() => {}, [result]);
  return null;
};

describe('useTestResults', () => {
  it('fetches and returns test results', async () => {
    axios.get.mockResolvedValueOnce(mockData);

    render(<HookWrapper id={1} />);

    await waitFor(() => expect(axios.get).toHaveBeenCalledWith('/api/test-results/1'));
  });

  it('handles errors during fetch', async () => {
    axios.get.mockRejectedValueOnce(new Error('Network Error'));

    render(<HookWrapper id={1} />);

    await waitFor(() => expect(axios.get).toHaveBeenCalledWith('/api/test-results/1'));
  });
});
