const { db } = require('../database');
const { getAllCourses, addCourse } = require('./courseController');

jest.mock('../database');

describe('courseController', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getAllCourses', () => {
        it('should return all courses', async () => {
            const mockCourses = [
                { id: 1, name: 'Course 1', description: 'Description 1', end_date: '2024-12-31' },
                { id: 2, name: 'Course 2', description: 'Description 2', end_date: '2024-11-30' },
            ];
            db.any.mockResolvedValue(mockCourses);

            const req = {};
            const res = {
                json: jest.fn(),
                status: jest.fn().mockReturnThis(),
            };

            await getAllCourses(req, res);

            expect(db.any).toHaveBeenCalledWith('SELECT * FROM courses');
            expect(res.json).toHaveBeenCalledWith(mockCourses);
        });

        it('should handle errors gracefully', async () => {
            db.any.mockRejectedValue(new Error('Database error'));

            const req = {};
            const res = {
                json: jest.fn(),
                status: jest.fn().mockReturnThis(),
            };

            await getAllCourses(req, res);

            expect(db.any).toHaveBeenCalledWith('SELECT * FROM courses');
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
        });
    });

    describe('addCourse', () => {
        it('should add a course and return the added course', async () => {
            const mockCourse = { id: 1, name: 'Course 1', description: 'Description 1', end_date: '2024-12-31' };
            db.one.mockResolvedValue(mockCourse);

            const req = {
                body: { name: 'Course 1', description: 'Description 1', end_date: '2024-12-31' },
            };
            const res = {
                json: jest.fn(),
                status: jest.fn().mockReturnThis(),
            };

            await addCourse(req, res);

            expect(db.one).toHaveBeenCalledWith(
                'INSERT INTO courses (name, description, end_date) VALUES ($1, $2, $3) RETURNING *',
                ['Course 1', 'Description 1', '2024-12-31']
            );
            expect(res.json).toHaveBeenCalledWith(mockCourse);
        });

        it('should handle errors gracefully', async () => {
            db.one.mockRejectedValue(new Error('Database error'));

            const req = {
                body: { name: 'Course 1', description: 'Description 1', end_date: '2024-12-31' },
            };
            const res = {
                json: jest.fn(),
                status: jest.fn().mockReturnThis(),
            };

            await addCourse(req, res);

            expect(db.one).toHaveBeenCalledWith(
                'INSERT INTO courses (name, description, end_date) VALUES ($1, $2, $3) RETURNING *',
                ['Course 1', 'Description 1', '2024-12-31']
            );
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
        });
    });
});
