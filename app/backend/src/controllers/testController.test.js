const { db } = require('../database');
const { addTest } = require('./testController');

jest.mock('../database');

describe('testController', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('addTest', () => {
        it('should add a test and return the test data', async () => {
            const mockRequest = {
                body: {
                    name: 'Test 1',
                    questions: [
                        { correctAnswer: ['1', '2'], num_options: 4, weight: 1 },
                        { correctAnswer: ['3'], num_options: 4, weight: 2 }
                    ],
                    courseId: 1
                }
            };
            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const mockResult = { id: 1 };
            
            db.one.mockResolvedValue(mockResult);
            db.none.mockResolvedValue();

            await addTest(mockRequest, mockResponse);

            expect(db.one).toHaveBeenCalledWith(
                'INSERT INTO exams (name, course_id) VALUES ($1, $2) RETURNING id',
                ['Test 1', 1]
            );
            expect(db.none).toHaveBeenCalledWith(
                'INSERT INTO questions (exam_id, correct_answer, num_options, weight) VALUES ($1, $2::integer[], $3, $4)',
                [1, [1, 2], 4, 1]
            );
            expect(db.none).toHaveBeenCalledWith(
                'INSERT INTO questions (exam_id, correct_answer, num_options, weight) VALUES ($1, $2::integer[], $3, $4)',
                [1, [3], 4, 2]
            );
            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith({ id: 1, name: 'Test 1', courseId: 1, questions: mockRequest.body.questions });
        });

        it('should handle errors gracefully', async () => {
            const mockRequest = {
                body: {
                    name: 'Test 1',
                    questions: [
                        { correctAnswer: ['1', '2'], num_options: 4, weight: 1 },
                        { correctAnswer: ['3'], num_options: 4, weight: 2 }
                    ],
                    courseId: 1
                }
            };
            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            db.one.mockRejectedValue(new Error('Database error'));

            await addTest(mockRequest, mockResponse);

            expect(db.one).toHaveBeenCalledWith(
                'INSERT INTO exams (name, course_id) VALUES ($1, $2) RETURNING id',
                ['Test 1', 1]
            );
            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
        });
    });
});
