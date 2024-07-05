// app/frontend/tests/hooks/getUserInfo.test.js

import getUserInfo from '../../../src/hooks/getUserInfo';

describe('getUserInfo Hook', () => {
  beforeEach(() => {
    // Clear the fetch mock before each test
    global.fetch = jest.fn();
    // Clear localStorage mock before each test
    localStorage.clear();
  });

  it('fetches user info successfully', async () => {
    const mockUser = {
      id: 1,
      name: 'John Doe',
      email: 'johndoe@example.com',
      role: 1,
    };

    localStorage.setItem('token', 'mockToken');

    // Mock the fetch function to return a successful response
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUser,
    });

    const result = await getUserInfo();

    expect(global.fetch).toHaveBeenCalledWith('http://localhost:80/api/auth/authenticate/mockToken');
    expect(result).toEqual(mockUser);
  });

  it('handles unsuccessful data fetching', async () => {
    localStorage.setItem('token', 'mockToken');

    // Mock the fetch function to return an unsuccessful response
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    });

    const result = await getUserInfo();

    expect(global.fetch).toHaveBeenCalledWith('http://localhost:80/api/auth/authenticate/mockToken');
    expect(result).toBeNull();
  });

  it('handles fetch error', async () => {
    localStorage.setItem('token', 'mockToken');

    // Mock the fetch function to throw an error
    global.fetch.mockRejectedValueOnce(new Error('Network error'));

    console.error = jest.fn();

    const result = await getUserInfo();

    expect(global.fetch).toHaveBeenCalledWith('http://localhost:80/api/auth/authenticate/mockToken');
    expect(console.error).toHaveBeenCalledWith('Error getting role:', new Error('Network error'));
    expect(result).toBeNull();
  });

  it('returns null if no token is found', async () => {
    const result = await getUserInfo();

    expect(global.fetch).not.toHaveBeenCalled();
    expect(result).toBeNull();
  });
});
