// app/frontend/tests/hooks/getCourseData.test.js

import getCourseData from 'hooks/getCourseData';

describe('getCourseData', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  it('fetches course data successfully', async () => {
    const mockCourses = [
      { id: 1, name: 'Math 101' },
      { id: 2, name: 'Math 102' },
    ];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCourses,
    });

    const userId = '123';
    const result = await getCourseData(userId);

    expect(fetch).toHaveBeenCalledWith(`http://localhost/api/users/courses/${userId}`);
    expect(result).toEqual(mockCourses);
  });

  it('handles error when response is not ok', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    });

    const userId = '123';
    const result = await getCourseData(userId);

    expect(fetch).toHaveBeenCalledWith(`http://localhost/api/users/courses/${userId}`);
    expect(result).toBeUndefined();
  });

  it('handles network error', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'));

    const userId = '123';
    const result = await getCourseData(userId);

    expect(fetch).toHaveBeenCalledWith(`http://localhost/api/users/courses/${userId}`);
    expect(result).toBeUndefined();
  });
});
