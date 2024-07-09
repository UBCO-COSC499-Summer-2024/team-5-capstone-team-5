jest.mock('../database', () => {
    return {
      manyOrNone: jest.fn(),
      oneOrNone: jest.fn(),
      none: jest.fn(),
      any: jest.fn(),
    };
  });
  
  const db = require('../database'); // This should point to the actual database module
  const { getCoursesByUserId } = require('./userController');
  
  describe('Get courses for user ID 1', () => {
    console.log(db);
  
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    it('Should respond with course data', async () => {
      const mockCourses = [
        { course_id: 1, name: 'Course 1', description: 'Description 1', end_date: '2024-12-31' },
        { course_id: 2, name: 'Course 2', description: 'Description 2', end_date: '2025-06-01' }
      ];
  
      db.manyOrNone.mockResolvedValue(mockCourses);
  
      const result = await getCoursesByUserId(1);
      expect(db.manyOrNone).toHaveBeenCalledWith(
        'SELECT course_id, name, description, end_date FROM users JOIN registration ON registration.user_id = users.id JOIN courses ON registration.course_id = courses.id WHERE users.id = $1',
        [1]
      );
      expect(result).toEqual(mockCourses);
    });
  
    it('Should handle errors gracefully', async () => {
      db.manyOrNone.mockRejectedValue(new Error('Database error'));
  
      const result = await getCoursesByUserId(1);
      expect(db.manyOrNone).toHaveBeenCalledWith(
        'SELECT course_id, name, description, end_date FROM users JOIN registration ON registration.user_id = users.id JOIN courses ON registration.course_id = courses.id WHERE users.id = $1',
        [1]
      );
      expect(result).toBeUndefined();
    });
  });
  