// app/frontend/tests/hooks/ChangePassword.test.js

import ChangePassword from '../../../src/hooks/ChangePassword';

describe('ChangePassword Hook', () => {
  beforeEach(() => {
    // Clear the fetch mock before each test
    global.fetch = jest.fn();
  });

  it('handles successful password change', async () => {
    // Mock the fetch function to return a successful response
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Password changed successfully' })
    });

    console.log = jest.fn();

    await ChangePassword('123', 'oldPassword', 'newPassword');

    expect(global.fetch).toHaveBeenCalledWith('http://localhost/api/auth/change', expect.any(Object));
    expect(console.log).toHaveBeenCalledWith('Password changed successfully');
  });

  it('handles unsuccessful password change', async () => {
    // Mock the fetch function to return an unsuccessful response
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Change password unsuccessful' })
    });

    console.log = jest.fn();

    await ChangePassword('123', 'oldPassword', 'newPassword');

    expect(global.fetch).toHaveBeenCalledWith('http://localhost/api/auth/change', expect.any(Object));
    expect(console.log).toHaveBeenCalledWith('Change password unsuccessful');
  });

  it('handles fetch error', async () => {
    // Mock the fetch function to throw an error
    global.fetch.mockRejectedValueOnce(new Error('Network error'));

    console.error = jest.fn();

    await ChangePassword('123', 'oldPassword', 'newPassword');

    expect(global.fetch).toHaveBeenCalledWith('http://localhost/api/auth/change', expect.any(Object));
    expect(console.error).toHaveBeenCalledWith('Change password failed:', new Error('Network error'));
  });
});
