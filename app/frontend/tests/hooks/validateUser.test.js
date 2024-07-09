// app/frontend/tests/hooks/validateUser.test.js

import validateUser from 'hooks/validateUser';

// Mocking fetch
global.fetch = jest.fn();

describe('validateUser', () => {
  let getItemSpy;

  beforeEach(() => {
    getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
    jest.clearAllMocks();
  });

  afterEach(() => {
    getItemSpy.mockRestore();
  });

  it('returns true when token is valid and user is authenticated', async () => {
    const mockToken = 'valid_token';
    const mockResponse = { id: 1, name: 'John Doe' };

    getItemSpy.mockReturnValue(mockToken);
    fetch.mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await validateUser();

    expect(localStorage.getItem).toHaveBeenCalledWith('token');
    expect(fetch).toHaveBeenCalledWith(`http://localhost:80/api/auth/authenticate/${mockToken}`);
    expect(result).toBe(true);
  });

  it('returns false when token is invalid', async () => {
    const mockToken = 'invalid_token';

    getItemSpy.mockReturnValue(mockToken);
    fetch.mockResolvedValue({
      ok: false,
    });

    const result = await validateUser();

    expect(localStorage.getItem).toHaveBeenCalledWith('token');
    expect(fetch).toHaveBeenCalledWith(`http://localhost:80/api/auth/authenticate/${mockToken}`);
    expect(result).toBe(false);
  });

  it('returns false when token is not present', async () => {
    getItemSpy.mockReturnValue(null);

    const result = await validateUser();

    expect(localStorage.getItem).toHaveBeenCalledWith('token');
    expect(fetch).not.toHaveBeenCalled();
    expect(result).toBe(false);
  });

  it('returns false when an error occurs during fetch', async () => {
    const mockToken = 'valid_token';

    getItemSpy.mockReturnValue(mockToken);
    fetch.mockRejectedValue(new Error('Network error'));

    const result = await validateUser();

    expect(localStorage.getItem).toHaveBeenCalledWith('token');
    expect(fetch).toHaveBeenCalledWith(`http://localhost:80/api/auth/authenticate/${mockToken}`);
    expect(result).toBe(false);
  });
});
