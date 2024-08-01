const request = require("supertest");
const app = require("../server");

describe("Test the routes in authRoutes", () => {

    test("POST /api/auth/login - Should return code 401 'Incorrect Credentials'", done => {
        request(app).post("/api/auth/login")
        .send({email: "wrong@email.com", password: "wrongpassword"})
        .then(response => {
            expect(response.statusCode).toBe(401)
            expect(response.body.message).toBe("Incorrect Credentials");
            done();
        }).catch(err => done(err));
    });

    test("GET /api/auth/authenticate/:token", done => {
        request(app).get("/api/auth/authenticate/")
        .then(response => {
            expect(response.statusCode).toBe(404);
            done();
        }).catch(err => done(err));
    });

    test("GET /api/auth/authenticate/:token", done => {
        request(app).get("/api/auth/authenticate/123")
        .then(response => {
            expect(response.statusCode).toBe(401);
            done();
        }).catch(err => done(err));
    });
});