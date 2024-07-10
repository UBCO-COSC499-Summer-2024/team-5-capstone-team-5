// app/frontend/tests/hooks/getRecentTests.test.js

import getRecentTests from 'hooks/getRecentTests';

describe('getRecentTests', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  it('fetches recent tests successfully', async () => {
    const mockTests = [
      { id: 1, name: 'Recent Test 1' },
      { id: 2, name: 'Recent Test 2' },
    ];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockTests,
    });

    const userId = '123';
    const result = await getRecentTests(userId);

    expect(fetch).toHaveBeenCalledWith(`http://localhost/api/users/tests/recent/${userId}`);
    expect(result).toEqual(mockTests);
  });

  it('handles error when response is not ok', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    });

    const userId = '123';
    const result = await getRecentTests(userId);

    expect(fetch).toHaveBeenCalledWith(`http://localhost/api/users/tests/recent/${userId}`);
    expect(result).toBeUndefined();
  });

  it('handles network error', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'));

    const userId = '123';
    const result = await getRecentTests(userId);

    expect(fetch).toHaveBeenCalledWith(`http://localhost/api/users/tests/recent/${userId}`);
    expect(result).toBeUndefined();
  });
});
