// app/frontend/tests/hooks/getQuestions.test.js

import getQuestions from 'hooks/getQuestions';

global.fetch = jest.fn();

describe('getQuestions', () => {
  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    console.error.mockRestore();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('fetches and returns questions data', async () => {
    const mockQuestions = [
      { id: 1, question: 'What is 2 + 2?' },
      { id: 2, question: 'What is the capital of France?' },
    ];

    fetch.mockResolvedValue({
      ok: true,
      json: async () => mockQuestions,
    });

    const result = await getQuestions('exam1', 'user1');
    expect(result).toEqual(mockQuestions);
    expect(fetch).toHaveBeenCalledWith('http://localhost/api/users/questions/exam1&user1');
  });

  it('handles non-200 responses', async () => {
    fetch.mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    });

    const result = await getQuestions('exam1', 'user1');
    expect(result).toBeUndefined();
    expect(fetch).toHaveBeenCalledWith('http://localhost/api/users/questions/exam1&user1');
    expect(console.error).toHaveBeenCalledWith('POST Error', 404, 'Not Found');
  });

  it('handles fetch errors', async () => {
    const mockError = new Error('Network Error');
    fetch.mockRejectedValue(mockError);

    const result = await getQuestions('exam1', 'user1');
    expect(result).toBeUndefined();
    expect(fetch).toHaveBeenCalledWith('http://localhost/api/users/questions/exam1&user1');
    expect(console.error).toHaveBeenCalledWith('Failure fetching data: ', mockError);
  });
});
