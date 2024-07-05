// app/frontend/tests/hooks/getStudentData.test.js

import getStudentData from '../../../src/hooks/getStudentData';

describe('getStudentData Hook', () => {
  beforeEach(() => {
    // Clear the fetch mock before each test
    global.fetch = jest.fn();
  });

  it('fetches student data successfully', async () => {
    const mockStudents = [
      { id: 1, first_name: 'John', last_name: 'Doe', role: 1 },
      { id: 2, first_name: 'Jane', last_name: 'Smith', role: 1 },
    ];

    // Mock the fetch function to return a successful response
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockStudents,
    });

    const result = await getStudentData('123');

    expect(global.fetch).toHaveBeenCalledWith('http://localhost/api/users/courses/students/123');
    expect(result).toEqual(mockStudents);
  });

  it('handles unsuccessful data fetching', async () => {
    // Mock the fetch function to return an unsuccessful response
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    });

    console.error = jest.fn();

    const result = await getStudentData('123');

    expect(global.fetch).toHaveBeenCalledWith('http://localhost/api/users/courses/students/123');
    expect(console.error).toHaveBeenCalledWith('GET Error', 404, 'Not Found');
    expect(result).toBeUndefined();
  });

  it('handles fetch error', async () => {
    // Mock the fetch function to throw an error
    global.fetch.mockRejectedValueOnce(new Error('Network error'));

    console.error = jest.fn();

    const result = await getStudentData('123');

    expect(global.fetch).toHaveBeenCalledWith('http://localhost/api/users/courses/students/123');
    expect(console.error).toHaveBeenCalledWith('Failure fetching data: ', new Error('Network error'));
    expect(result).toBeUndefined();
  });
});
