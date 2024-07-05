// app/frontend/tests/hooks/getCourseData.test.js

import getCourseData from '../../../src/hooks/getCourseData';

describe('getCourseData Hook', () => {
  beforeEach(() => {
    // Clear the fetch mock before each test
    global.fetch = jest.fn();
  });

  it('fetches course data successfully', async () => {
    const mockCourses = [
      { id: 1, name: 'Course 1', description: 'Description 1' },
      { id: 2, name: 'Course 2', description: 'Description 2' }
    ];

    // Mock the fetch function to return a successful response
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCourses
    });

    console.log = jest.fn();

    const result = await getCourseData('123');

    expect(global.fetch).toHaveBeenCalledWith('http://localhost/api/users/courses/123');
    expect(console.log).toHaveBeenCalledWith(mockCourses);
    expect(result).toEqual(mockCourses);
  });

  it('handles unsuccessful data fetching', async () => {
    // Mock the fetch function to return an unsuccessful response
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: 'Not Found'
    });

    console.error = jest.fn();

    const result = await getCourseData('123');

    expect(global.fetch).toHaveBeenCalledWith('http://localhost/api/users/courses/123');
    expect(console.error).toHaveBeenCalledWith('POST Error', 404, 'Not Found');
    expect(result).toBeUndefined();
  });

  it('handles fetch error', async () => {
    // Mock the fetch function to throw an error
    global.fetch.mockRejectedValueOnce(new Error('Network error'));

    console.error = jest.fn();

    const result = await getCourseData('123');

    expect(global.fetch).toHaveBeenCalledWith('http://localhost/api/users/courses/123');
    expect(console.error).toHaveBeenCalledWith('Failure fetching data: ', new Error('Network error'));
    expect(result).toBeUndefined();
  });
});
