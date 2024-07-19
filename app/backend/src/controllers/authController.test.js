const { db } = require('../database');
const jwt = require('jsonwebtoken');
const { authUser, verifyUser, verifyPass } = require('./authController');

jest.mock('../database');
jest.mock('jsonwebtoken');

describe('authController', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('authUser', () => {
        it('should return a token for valid credentials', async () => {
            const mockUser = { id: 1, email: 'test@example.com', password: 'password', role: 'user', first_name: 'John', last_name: 'Doe' };
            db.oneOrNone.mockResolvedValue(mockUser);
            jwt.sign.mockReturnValue('mockToken');

            const result = await authUser('test@example.com', 'password');

            expect(db.oneOrNone).toHaveBeenCalledWith('SELECT * FROM users WHERE email = $1', ['test@example.com']);
            expect(jwt.sign).toHaveBeenCalledWith({ userId: mockUser.id, role: mockUser.role, name: 'John Doe', userEmail: mockUser.email }, 'coscrules', { expiresIn: '12h' });
            expect(result).toEqual({ token: 'mockToken' });
        });

        it('should return undefined for invalid credentials', async () => {
            const mockUser = { id: 1, email: 'test@example.com', password: 'password', role: 'user', first_name: 'John', last_name: 'Doe' };
            db.oneOrNone.mockResolvedValue(mockUser);

            const result = await authUser('test@example.com', 'wrongpassword');

            expect(db.oneOrNone).toHaveBeenCalledWith('SELECT * FROM users WHERE email = $1', ['test@example.com']);
            expect(result).toBeUndefined();
        });

        it('should return undefined for non-existing user', async () => {
            db.oneOrNone.mockResolvedValue(null);

            const result = await authUser('nonexistent@example.com', 'password');

            expect(db.oneOrNone).toHaveBeenCalledWith('SELECT * FROM users WHERE email = $1', ['nonexistent@example.com']);
            expect(result).toBeUndefined();
        });

        it('should handle errors gracefully', async () => {
            db.oneOrNone.mockRejectedValue(new Error('Database error'));

            const result = await authUser('test@example.com', 'password');

            expect(db.oneOrNone).toHaveBeenCalledWith('SELECT * FROM users WHERE email = $1', ['test@example.com']);
            expect(result).toBeUndefined();
        });
    });

    describe('verifyUser', () => {
        it('should return decoded token for a valid token', async () => {
            const mockDecoded = { userId: 1, role: 'user' };
            jwt.verify.mockImplementation((token, secret, callback) => callback(null, mockDecoded));

            const result = await verifyUser('validToken');

            expect(jwt.verify).toHaveBeenCalledWith('validToken', 'coscrules', expect.any(Function));
            expect(result).toEqual(mockDecoded);
        });

        it('should return null for an invalid token', async () => {
            jwt.verify.mockImplementation((token, secret, callback) => callback(new Error('Invalid JWT'), null));

            const result = await verifyUser('invalidToken');

            expect(jwt.verify).toHaveBeenCalledWith('invalidToken', 'coscrules', expect.any(Function));
            expect(result).toBeNull();
        });

        it('should return null for a null token', async () => {
            const result = await verifyUser('null');

            expect(result).toBeUndefined();
        });
    });

    describe('verifyPass', () => {
        it('should update password for valid old password', async () => {
            db.oneOrNone.mockResolvedValue({ password: 'oldPassword' });
            db.none.mockResolvedValue();

            await verifyPass(1, 'oldPassword', 'newPassword');

            expect(db.oneOrNone).toHaveBeenCalledWith('SELECT password FROM users WHERE id = $1', [1]);
            expect(db.none).toHaveBeenCalledWith('UPDATE users SET password = $1 WHERE id = $2', ['newPassword', 1]);
        });

        it('should not update password for invalid old password', async () => {
            db.oneOrNone.mockResolvedValue({ password: 'oldPassword' });

            await verifyPass(1, 'wrongOldPassword', 'newPassword');

            expect(db.oneOrNone).toHaveBeenCalledWith('SELECT password FROM users WHERE id = $1', [1]);
            expect(db.none).not.toHaveBeenCalled();
        });

        it('should handle errors gracefully', async () => {
            db.oneOrNone.mockRejectedValue(new Error('Database error'));

            const result = await verifyPass(1, 'oldPassword', 'newPassword');

            expect(db.oneOrNone).toHaveBeenCalledWith('SELECT password FROM users WHERE id = $1', [1]);
            expect(result).toBeNull();
        });
    });
});
