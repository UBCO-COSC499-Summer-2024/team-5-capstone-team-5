import getAllUsers from './getAllUsers';

describe('getAllUsers Hook', () => {
  test('fetches users and returns an array', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve([{ id: '1', name: 'John Doe', email: 'johndoe@example.com' }]),
      })
    );

    const users = await getAllUsers();
    expect(Array.isArray(users)).toBe(true);
    expect(users).toHaveLength(1);
    expect(users[0].name).toBe('John Doe');
  });

  test('returns an empty array if fetch fails', async () => {
    global.fetch = jest.fn(() => Promise.reject('API is down'));

    const users = await getAllUsers();
    expect(users).toEqual([]);
  });
});
