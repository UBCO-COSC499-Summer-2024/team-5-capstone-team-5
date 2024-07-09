// app/frontend/tests/hooks/ChangePassword.test.js

import ChangePassword from 'hooks/ChangePassword';

describe('ChangePassword', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  it('successfully changes password', async () => {
    fetch.mockResponseOnce(JSON.stringify({}), { status: 200 });

    console.log = jest.fn(); // Mock console.log

    await ChangePassword(1, 'oldPassword', 'newPassword');

    expect(fetch).toHaveBeenCalledWith('http://localhost/api/auth/change', expect.objectContaining({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 1, oldPass: 'oldPassword', newPass: 'newPassword' })
    }));

    expect(console.log).toHaveBeenCalledWith('Password changed successfully');
  });

  it('logs an error if changing password fails', async () => {
    fetch.mockResponseOnce(JSON.stringify({}), { status: 400 });

    console.log = jest.fn(); // Mock console.log

    await ChangePassword(1, 'oldPassword', 'newPassword');

    expect(fetch).toHaveBeenCalledWith('http://localhost/api/auth/change', expect.objectContaining({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 1, oldPass: 'oldPassword', newPass: 'newPassword' })
    }));

    expect(console.log).toHaveBeenCalledWith('Change password unsuccessful');
  });

  it('catches and logs errors during the fetch', async () => {
    const mockError = new Error('Network Error');
    fetch.mockReject(mockError);

    console.error = jest.fn(); // Mock console.error

    await ChangePassword(1, 'oldPassword', 'newPassword');

    expect(fetch).toHaveBeenCalledWith('http://localhost/api/auth/change', expect.objectContaining({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 1, oldPass: 'oldPassword', newPass: 'newPassword' })
    }));

    expect(console.error).toHaveBeenCalledWith('Change password failed:', mockError);
  });
});
