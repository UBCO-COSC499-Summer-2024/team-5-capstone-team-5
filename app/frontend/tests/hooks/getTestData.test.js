// app/frontend/tests/hooks/getTestData.test.js

import getTestData from 'hooks/getTestData';

describe('getTestData', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  it('fetches test data successfully', async () => {
    const mockTests = [
      { id: 1, name: 'Test 1' },
      { id: 2, name: 'Test 2' },
    ];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockTests,
    });

    const courseId = '456';
    const result = await getTestData(courseId);

    expect(fetch).toHaveBeenCalledWith(`http://localhost/api/users/tests/${courseId}`);
    expect(result).toEqual(mockTests);
  });

  it('handles error when response is not ok', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    });

    const courseId = '456';
    const result = await getTestData(courseId);

    expect(fetch).toHaveBeenCalledWith(`http://localhost/api/users/tests/${courseId}`);
    expect(result).toBeUndefined();
  });

  it('handles network error', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'));

    const courseId = '456';
    const result = await getTestData(courseId);

    expect(fetch).toHaveBeenCalledWith(`http://localhost/api/users/tests/${courseId}`);
    expect(result).toBeUndefined();
  });
});
