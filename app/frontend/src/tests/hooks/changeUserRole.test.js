import changeUserRole from './changeUserRole';

describe('changeUserRole Hook', () => {
  test('changes user role and returns true on success', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      })
    );

    const result = await changeUserRole('1', 2);
    expect(result).toBe(true);
  });

  test('returns false if the request fails', async () => {
    global.fetch = jest.fn(() => Promise.resolve({ ok: false }));

    const result = await changeUserRole('1', 2);
    expect(result).toBe(false);
  });
});
