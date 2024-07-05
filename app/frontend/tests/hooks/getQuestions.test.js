// app/frontend/tests/hooks/getQuestions.test.js

import getQuestions from '../../../src/hooks/getQuestions';

describe('getQuestions Hook', () => {
  beforeEach(() => {
    // Clear the fetch mock before each test
    global.fetch = jest.fn();
  });

  it('fetches questions data successfully', async () => {
    const mockQuestions = [
      { id: 1, question: 'What is 2+2?', options: ['1', '2', '3', '4'], correctAnswer: 3 },
      { id: 2, question: 'What is 3+3?', options: ['3', '4', '5', '6'], correctAnswer: 3 },
    ];

    // Mock the fetch function to return a successful response
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockQuestions,
    });

    const result = await getQuestions('456', '123');

    expect(global.fetch).toHaveBeenCalledWith('http://localhost/api/users/questions/456&123');
    expect(result).toEqual(mockQuestions);
  });

  it('handles unsuccessful data fetching', async () => {
    // Mock the fetch function to return an unsuccessful response
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    });

    console.error = jest.fn();

    const result = await getQuestions('456', '123');

    expect(global.fetch).toHaveBeenCalledWith('http://localhost/api/users/questions/456&123');
    expect(console.error).toHaveBeenCalledWith('POST Error', 404, 'Not Found');
    expect(result).toBeUndefined();
  });

  it('handles fetch error', async () => {
    // Mock the fetch function to throw an error
    global.fetch.mockRejectedValueOnce(new Error('Network error'));

    console.error = jest.fn();

    const result = await getQuestions('456', '123');

    expect(global.fetch).toHaveBeenCalledWith('http://localhost/api/users/questions/456&123');
    expect(console.error).toHaveBeenCalledWith('Failure fetching data: ', new Error('Network error'));
    expect(result).toBeUndefined();
  });
});
