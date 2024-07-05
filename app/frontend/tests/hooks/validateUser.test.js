// app/frontend/tests/hooks/validateUser.test.js

import validateUser from '../../../src/hooks/validateUser';

describe('validateUser Hook', () => {
  beforeEach(() => {
    // Clear the fetch mock before each test
    global.fetch = jest.fn();
    // Clear localStorage mock before each test
    localStorage.clear();
  });

  it('validates user successfully', async () => {
    const mockUser = {
      id: 1,
      name: 'John Doe',
      email: 'johndoe@example.com',
    };

    localStorage.setItem('token', 'mockToken');

    // Mock the fetch function to return a successful response
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUser,
    });

    const result = await validateUser();

    expect(global.fetch).toHaveBeenCalledWith('http://localhost:80/api/auth/authenticate/mockToken');
    expect(result).toBe(true);
  });

  it('handles unsuccessful validation', async () => {
    localStorage.setItem('token', 'mockToken');

    // Mock the fetch function to return an unsuccessful response
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    });

    const result = await validateUser();

    expect(global.fetch).toHaveBeenCalledWith('http://localhost:80/api/auth/authenticate/mockToken');
    expect(result).toBe(false);
  });

  it('handles validation error', async () => {
    localStorage.setItem('token', 'mockToken');

    // Mock the fetch function to throw an error
    global.fetch.mockRejectedValueOnce(new Error('Network error'));

    console.error = jest.fn();

    const result = await validateUser();

    expect(global.fetch).toHaveBeenCalledWith('http://localhost:80/api/auth/authenticate/mockToken');
    expect(console.error).toHaveBeenCalledWith('Error during user validation:', new Error('Network error'));
    expect(result).toBe(false);
  });

  it('returns false if no token is found', async () => {
    const result = await validateUser();

    expect(global.fetch).not.toHaveBeenCalled();
    expect(result).toBe(false);
  });
});
