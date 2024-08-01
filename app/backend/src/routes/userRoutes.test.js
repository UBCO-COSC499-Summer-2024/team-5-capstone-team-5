const request = require("supertest");
const app = require("../server");

describe("Test the routes in userRoutes", () => {

    // Test for GET /api/users/courses/:id
    test("GET /api/users/courses/:id - It should return 200", done => {
        request(app).get("/api/users/courses/1").then(response => {
            expect(response.statusCode).toBe(200);
            done();
        }).catch(err => done(err));
    });

    test("GET /api/users/courses - It should return 404", done => {
        request(app).get("/api/users/courses").then(response => {
            expect(response.statusCode).toBe(404);
            done();
        }).catch(err => done(err));
    });

    // Test for GET /api/users/tests/:id
    test("GET /api/users/tests/:id - It should return 200", done => {
        request(app).get("/api/users/tests/1").then(response => {
            expect(response.statusCode).toBe(200);
            done();
        }).catch(err => done(err));
    });

    test("GET /api/users/tests - It should return 404", done => {
        request(app).get("/api/users/tests").then(response => {
            expect(response.statusCode).toBe(404);
            done();
        }).catch(err => done(err));
    });

    // Test for GET /api/users/responses/:qid&:uid
    test("GET /api/users/questions/:qid&:uid - It should return 200", done => {
        request(app).get("/api/users/questions/1&1").then(response => {
            expect(response.statusCode).toBe(200);
            done();
        }).catch(err => done(err));
    }, 20000); // Increase timeout to 20000 ms

    test("GET /api/users/questions - It should return 404 when missing parameters", done => {
        request(app).get("/api/users/questions/").then(response => {
            expect(response.statusCode).toBe(404);
            done();
        }).catch(err => done(err));
    }, 20000); // Increase timeout to 20000 ms

    // Test for GET /api/users/tests/recent/:id
    test("GET /api/users/tests/recent/:id - It should return 200", done => {
        request(app).get("/api/users/tests/recent/1").then(response => {
            expect(response.statusCode).toBe(200);
            done();
        }).catch(err => done(err));
    });

    // Test for POST /api/users/courses/add
    test("POST /api/users/courses/add - It should return 200", done => {
        request(app)
            .post("/api/users/courses/add")
            .send({ name: "Course 1", description: "Description 1", end_date: "2024-12-31", user_id: 1, course_id: 1 })
            .then(response => {
                expect(response.statusCode).toBe(200);
                done();
            }).catch(err => done(err));
    });

    test("POST /api/users/courses/add - It should return 400 on missing parameters", done => {
        request(app)
            .post("/api/users/courses/add")
            .send({ name: "Course 1", description: "Description 1", end_date: "2024-12-31" }) // Missing user_id and course_id
            .then(response => {
                expect(response.statusCode).toBe(400);
                done();
            }).catch(err => done(err));
    });

    // Additional test cases for missing parameters
    test("POST /api/users/courses/add - It should return 400 on missing parameters (only name)", done => {
        request(app)
            .post("/api/users/courses/add")
            .send({ name: "Course 1" }) // Missing all except name
            .then(response => {
                expect(response.statusCode).toBe(400);
                done();
            }).catch(err => done(err));
    });

    test("POST /api/users/courses/add - It should return 400 on missing parameters (name and description)", done => {
        request(app)
            .post("/api/users/courses/add")
            .send({ name: "Course 1", description: "Description 1" }) // Missing all except name and description
            .then(response => {
                expect(response.statusCode).toBe(400);
                done();
            }).catch(err => done(err));
    });

    test("GET /api/users/courses/students/:id - It should return 200 when requested", done => {
        request(app)
            .get("/api/users/courses/students/1")
            .then(response => {
                expect(response.statusCode).toBe(200);
                done();
            }).catch(err => done(err));
    });

    test("GET /api/users/questions/answers/:examId - It should return 200 when requested", done => {
        request(app)
            .get("/api/users/questions/answers/1")
            .then(response => {
                expect(response.statusCode).toBe(200);
                done();
            }).catch(err => done(err));
    });

    test("GET /api/users/questions/answers/:examId - It should return 400 when requested without parameters", done => {
        request(app)
            .get("/api/users/questions/answers/")
            .then(response => {
                expect(response.statusCode).toBe(404);
                done();
            }).catch(err => done(err));
    });

    test("GET /api/users/courses/grades/:id - It should return 200 when requested", done => {
        request(app)
            .get("/api/users/courses/grades/1")
            .then(response => {
                expect(response.statusCode).toBe(200);
                done();
            }).catch(err => done(err));
    });

});