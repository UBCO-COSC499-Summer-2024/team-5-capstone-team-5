// app/frontend/tests/hooks/getRecentTests.test.js

import getRecentTests from '../../../src/hooks/getRecentTests';

describe('getRecentTests Hook', () => {
  beforeEach(() => {
    // Clear the fetch mock before each test
    global.fetch = jest.fn();
  });

  it('fetches recent tests data successfully', async () => {
    const mockTests = [
      { id: 1, name: 'Test 1', date_marked: '2023-12-01T00:00:00Z', course_name: 'Course 1' },
      { id: 2, name: 'Test 2', date_marked: '2023-12-02T00:00:00Z', course_name: 'Course 2' },
    ];

    // Mock the fetch function to return a successful response
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockTests,
    });

    const result = await getRecentTests('123');

    expect(global.fetch).toHaveBeenCalledWith('http://localhost/api/users/tests/recent/123');
    expect(result).toEqual(mockTests);
  });

  it('handles unsuccessful data fetching', async () => {
    // Mock the fetch function to return an unsuccessful response
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    });

    console.error = jest.fn();

    const result = await getRecentTests('123');

    expect(global.fetch).toHaveBeenCalledWith('http://localhost/api/users/tests/recent/123');
    expect(console.error).toHaveBeenCalledWith('POST Error', 404, 'Not Found');
    expect(result).toBeUndefined();
  });

  it('handles fetch error', async () => {
    // Mock the fetch function to throw an error
    global.fetch.mockRejectedValueOnce(new Error('Network error'));

    console.error = jest.fn();

    const result = await getRecentTests('123');

    expect(global.fetch).toHaveBeenCalledWith('http://localhost/api/users/tests/recent/123');
    expect(console.error).toHaveBeenCalledWith('Failure fetching data: ', new Error('Network error'));
    expect(result).toBeUndefined();
  });
});
