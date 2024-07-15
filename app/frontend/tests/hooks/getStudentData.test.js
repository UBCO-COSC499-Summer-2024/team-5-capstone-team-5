// app/frontend/tests/hooks/getStudentData.test.js

import getStudentData from 'hooks/getStudentData';

global.fetch = jest.fn();

describe('getStudentData', () => {
  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    console.error.mockRestore();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('fetches and returns student data', async () => {
    const mockStudents = [
      { id: 1, name: 'Student 1' },
      { id: 2, name: 'Student 2' },
    ];

    fetch.mockResolvedValue({
      ok: true,
      json: async () => mockStudents,
    });

    const result = await getStudentData('course1');
    expect(result).toEqual(mockStudents);
    expect(fetch).toHaveBeenCalledWith('http://localhost/api/users/courses/students/course1');
  });

  it('handles non-200 responses', async () => {
    fetch.mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    });

    const result = await getStudentData('course1');
    expect(result).toBeUndefined();
    expect(fetch).toHaveBeenCalledWith('http://localhost/api/users/courses/students/course1');
    expect(console.error).toHaveBeenCalledWith('GET Error', 404, 'Not Found');
  });

  it('handles fetch errors', async () => {
    const mockError = new Error('Network Error');
    fetch.mockRejectedValue(mockError);

    const result = await getStudentData('course1');
    expect(result).toBeUndefined();
    expect(fetch).toHaveBeenCalledWith('http://localhost/api/users/courses/students/course1');
    expect(console.error).toHaveBeenCalledWith('Failure fetching data: ', mockError);
  });
});
