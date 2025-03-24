import request from "supertest";
import app from "../../src/api/app";
import { ADMIN_LOGIN } from "../helpers/admin.helpers";
import { USER_LOGIN } from "../helpers/user.helpers";

jest.useFakeTimers({ now: Date.now(), advanceTimers: true });

describe('Auth Router', () => {

    describe("POST /auth/login/admin", () => {
        it("should login admin", async () => {
            const res = await request(app)
                .post("/api/v1/auth/login/admin")
                .send({ phone: process.env.ADMIN_PHONE, password: process.env.ADMIN_PASSWORD });

            expect(res.status).toBe(200);
            //* token cookie
            expect(res.headers['set-cookie'][0].split('=')[0]).toBe('token');
            expect(res.body.data).toHaveProperty('admin');
            expect(res.body.data.admin.phone).toBe(process.env.ADMIN_PHONE);
        });

        it("return 400 if phone number not found", async () => {
            const res = await request(app)
                .post("/api/v1/auth/login/admin")
                .send({ phone: "918086009878", password: process.env.ADMIN_PASSWORD });

            expect(res.status).toBe(400);
            expect(res.body.message).toBe("Phone number not found.");
        });

        it("return 400 if password is wrong", async () => {
            const res = await request(app)
                .post("/api/v1/auth/login/admin")
                .send({ phone: process.env.ADMIN_PHONE, password: "wrongpassword" });

            expect(res.status).toBe(400);
            expect(res.body.message).toBe("Invalid credentials.");
        });

        it("return 400 if phone number is invalid", async () => {
            const res = await request(app)
                .post("/api/v1/auth/login/admin")
                .send({ phone: "12356789", password: process.env.ADMIN_PASSWORD });

            expect(res.status).toBe(400);
            expect(res.body.message).toBe("Invalid phone number.");
        });

        it("return 400 if password is invalid", async () => {
            const res = await request(app)
                .post("/api/v1/auth/login/admin")
                .send({ phone: process.env.ADMIN_PHONE, password: "123" });

            expect(res.status).toBe(400);
            expect(res.body.message).toBe("Invalid password.");
        });

    });

    describe("POST /auth/verify/admin", () => {
        it("should verify admin", async () => {
            const res = await ADMIN_LOGIN();
            const token = res.headers['set-cookie'][0].split('=')[1].split(';')[0];

            const verifyRes = await request(app)
                .post("/api/v1/auth/verify/admin")
                .set('Cookie', `token=${token}`);

            expect(verifyRes.status).toBe(200);
            expect(verifyRes.body.message).toBe("Admin verified successfully.");
            expect(verifyRes.body.data).toHaveProperty('admin');
            expect(verifyRes.body.data.admin.phone).toBe(process.env.ADMIN_PHONE);
        });

        it("return 401 if token not provided", async () => {
            const res = await request(app)
                .post("/api/v1/auth/verify/admin");

            expect(res.status).toBe(401);
            expect(res.body.message).toBe("Unauthorized, please login.");
        });

        it("return 401 if token is invalid", async () => {
            const res = await request(app)
                .post("/api/v1/auth/verify/admin")
                .set('Cookie', `token=invalidtoken`);

            expect(res.status).toBe(401);
            expect(res.body.message).toBe("Unauthorized, please login.");
        });

        it("return 401 if token is expired", async () => {

            const res = await ADMIN_LOGIN();
            const token = res.headers["set-cookie"][0].split("=")[1].split(";")[0];

            jest.advanceTimersByTime(1000 * 60 * 60 * 36 * 1.5); // Simulate 1.5 days passing

            const verifyRes = await request(app)
                .post("/api/v1/auth/verify/admin")
                .set("Cookie", `token=${token}`);

            expect(verifyRes.status).toBe(401);
            expect(verifyRes.body.message).toBe("Unauthorized, please login.");

        });

    });

    describe("GET /auth/logout/admin", () => {
        it("should logout admin", async () => {
            const res = await ADMIN_LOGIN();
            const token = res.headers['set-cookie'][0].split('=')[1].split(';')[0];

            const logoutRes = await request(app)
                .post("/api/v1/auth/logout/admin")
                .set('Cookie', `token=${token}`);

            expect(logoutRes.status).toBe(200);
            expect(logoutRes.headers['set-cookie'][0].split('=')[0]).toBe('token');
            expect(logoutRes.headers['set-cookie'][0].split('=')[1]).toBe('; Path');
            expect(logoutRes.body.message).toBe("Admin logout successfully.");

        });

        it("return 401 if token not provided", async () => {
            const res = await request(app)
                .post("/api/v1/auth/logout/admin");

            expect(res.status).toBe(401);
            expect(res.body.message).toBe("Unauthorized, please login.");
        });
    });

    describe("POST /auth/login/user", () => {
        it("should login user", async () => {
            const res = await request(app)
                .post("/api/v1/auth/login/user")
                .send({ phone: process.env.USER_PHONE, password: process.env.USER_PASSWORD });

            expect(res.status).toBe(200);
            //* token cookie
            expect(res.headers['set-cookie'][0].split('=')[0]).toBe('token');
            expect(res.body.data).toHaveProperty('user');
            expect(res.body.data.user.phone).toBe(process.env.USER_PHONE);
        });

        it("should login and must have wallet. transactions and balance is must defined", async () => {
            const res = await request(app)
                .post("/api/v1/auth/login/user")
                .send({ phone: process.env.USER_PHONE, password: process.env.USER_PASSWORD });

            expect(res.status).toBe(200);
            expect(res.body.data.user).toHaveProperty('wallet');
            expect(res.body.data.user.wallet).toHaveProperty('balance');
            expect(res.body.data.user.wallet).toHaveProperty('transactions');
        });

        it("should login and must return the invested amount of the user", async () => {
            const res = await request(app)
                .post("/api/v1/auth/login/user")
                .send({ phone: process.env.USER_PHONE, password: process.env.USER_PASSWORD });

            expect(res.status).toBe(200);
            expect(res.body.data.user).toHaveProperty('invested');
            expect(res.body.data.user.invested).toBe(1000);
        });

        it("return 400 if phone number not found", async () => {
            const res = await request(app)
                .post("/api/v1/auth/login/user")
                .send({ phone: "917293328401", password: process.env.USER_PASSWORD });

            expect(res.status).toBe(400);
            expect(res.body.message).toBe("Phone number not found.");
        });

        it("return 400 if password is wrong", async () => {
            const res = await request(app)
                .post("/api/v1/auth/login/user")
                .send({ phone: process.env.USER_PHONE, password: "wrongpassword" });

            expect(res.status).toBe(400);
            expect(res.body.message).toBe("Invalid credentials.");
        });

        it("return 400 if phone number is invalid", async () => {
            const res = await request(app)
                .post("/api/v1/auth/login/user")
                .send({ phone: "12356789", password: process.env.USER_PASSWORD });

            expect(res.status).toBe(400);
            expect(res.body.message).toBe("Invalid phone number.");
        });

        it("return 400 if password is invalid", async () => {
            const res = await request(app)
                .post("/api/v1/auth/login/user")
                .send({ phone: process.env.USER_PHONE, password: "123" });

            expect(res.status).toBe(400);
            expect(res.body.message).toBe("Invalid password.");
        });
    });

    describe("POST /auth/verify/user", () => {
        it("should verify user", async () => {
            const res = await USER_LOGIN();
            const token = res.headers['set-cookie'][0].split('=')[1].split(';')[0];

            const verifyRes = await request(app)
                .post("/api/v1/auth/verify/user")
                .set('Cookie', `token=${token}`);

            expect(verifyRes.status).toBe(200);
            expect(verifyRes.body.message).toBe("User verified successfully.");
            expect(verifyRes.body.data).toHaveProperty('user');
            expect(verifyRes.body.data.user.phone).toBe(process.env.USER_PHONE);
        });

        it("return 401 if token not provided", async () => {
            const res = await request(app)
                .post("/api/v1/auth/verify/user");

            expect(res.status).toBe(401);
            expect(res.body.message).toBe("Unauthorized, please login.");
        });

        it("return 401 if token is invalid", async () => {
            const res = await request(app)
                .post("/api/v1/auth/verify/user")
                .set('Cookie', `token=invalidtoken`);

            expect(res.status).toBe(401);
            expect(res.body.message).toBe("Unauthorized, please login.");
        });

        it("return 401 if token is expired", async () => {

            const res = await USER_LOGIN();
            const token = res.headers["set-cookie"][0].split("=")[1].split(";")[0];

            jest.advanceTimersByTime(1000 * 60 * 60 * 36 * 1.5); // Simulate 1.5 days passing

            const verifyRes = await request(app)
                .post("/api/v1/auth/verify/user")
                .set("Cookie", `token=${token}`);

            expect(verifyRes.status).toBe(401);
            expect(verifyRes.body.message).toBe("Unauthorized, please login.");
        });
    });

    describe("POST /auth/logout/user", () => {
        it("should logout user", async () => {
            const res = await USER_LOGIN();
            const token = res.headers['set-cookie'][0].split('=')[1].split(';')[0];

            const logoutRes = await request(app)
                .post("/api/v1/auth/logout/user")
                .set('Cookie', `token=${token}`);

            expect(logoutRes.status).toBe(200);
            expect(logoutRes.headers['set-cookie'][0].split('=')[0]).toBe('token');
            expect(logoutRes.headers['set-cookie'][0].split('=')[1]).toBe('; Path');
            expect(logoutRes.body.message).toBe("User logout successfully.");
        });

        it("return 401 if token not provided", async () => {
            const res = await request(app)
                .post("/api/v1/auth/logout/user");

            expect(res.status).toBe(401);
            expect(res.body.message).toBe("Unauthorized, please login.");
        });
    });

});