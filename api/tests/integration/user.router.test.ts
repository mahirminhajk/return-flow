import request from "supertest";
import app from "../../src/api/app";
import { USER_LOGIN } from "../helpers/user.helpers";

describe("Wallet Router", () => {
    describe("POST /user/wallet/request-withdraw", () => {
        it("should successfully request a withdraw", async () => {
            const res = await USER_LOGIN();
            const token = res.headers['set-cookie'][0].split('=')[1].split(';')[0];

            const withdrawReq = {
                amount: 100,
                description: "Test withdraw request"
            };

            const response = await request(app)
                .post("/api/v1/user/wallet/request-withdraw")
                .set("Cookie", `token=${token}`)
                .send(withdrawReq);

            expect(response.status).toBe(200);
        });

        it("should successfully request a withdraw and response the wallet and transaction", async () => {
            const res = await USER_LOGIN();
            const token = res.headers['set-cookie'][0].split('=')[1].split(';')[0];

            const withdrawReq = {
                amount: 100,
                description: "Test withdraw request"
            };

            const response = await request(app)
                .post("/api/v1/user/wallet/request-withdraw")
                .set("Cookie", `token=${token}`)
                .send(withdrawReq);

            expect(response.status).toBe(200);
            expect(response.body.data.wallet).toBeDefined();
            expect(response.body.data.transaction).toBeDefined();
        });

        it("should fail to request a withdraw due to insufficient balance", async () => {
            const res = await USER_LOGIN();
            const token = res.headers['set-cookie'][0].split('=')[1].split(';')[0];

            const withdrawReq = {
                amount: 1000000,
                description: "Test withdraw request"
            };

            const response = await request(app)
                .post("/api/v1/user/wallet/request-withdraw")
                .set("Cookie", `token=${token}`)
                .send(withdrawReq);

            expect(response.status).toBe(400);
            expect(response.body.message).toBe("Insufficient balance.");
        });

        it("should return unauthorized error when user is not logged in", async () => {
            const withdrawReq = {
                amount: 100,
                description: "Test withdraw request"
            };

            const response = await request(app)
                .post("/api/v1/user/wallet/request-withdraw")
                .send(withdrawReq);

            expect(response.status).toBe(401);
            expect(response.body.message).toBe("Unauthorized, please login.");
        });

        it("should return a validation error when amount is invalid or missing", async () => {
            const res = await USER_LOGIN();
            const token = res.headers['set-cookie'][0].split('=')[1].split(';')[0];

            const withdrawReq = {
                description: "Test withdraw request"
            };

            const response = await request(app)
                .post("/api/v1/user/wallet/request-withdraw")
                .set("Cookie", `token=${token}`)
                .send(withdrawReq);

            expect(response.status).toBe(400);
            expect(response.body.message).toBe("Amount is required.");
            expect(response.body.field).toBe("amount");

            const withdrawReq2 = {
                amount: "invalid",
                description: "Test withdraw request"
            };

            const response2 = await request(app)
                .post("/api/v1/user/wallet/request-withdraw")
                .set("Cookie", `token=${token}`)
                .send(withdrawReq2);

            expect(response2.status).toBe(400);
            expect(response2.body.message).toBe("Amount must be a number.");
            expect(response2.body.field).toBe("amount");

            const withdrawReq3 = {
                amount: 0,
                description: "Test withdraw request"
            };

            const response3 = await request(app)
                .post("/api/v1/user/wallet/request-withdraw")
                .set("Cookie", `token=${token}`)
                .send(withdrawReq3);

            expect(response3.status).toBe(400);
            expect(response3.body.message).toBe("Amount must be greater than 0.");
            expect(response3.body.field).toBe("amount");
        });

        it("should return a validation error when description is invalid or missing", async () => {
            const res = await USER_LOGIN();
            const token = res.headers['set-cookie'][0].split('=')[1].split(';')[0];

            const withdrawReq = {
                amount: 1
            };

            const response = await request(app)
                .post("/api/v1/user/wallet/request-withdraw")
                .set("Cookie", `token=${token}`)
                .send(withdrawReq);

            expect(response.status).toBe(400);
            expect(response.body.message).toBe("Description is required.");
            expect(response.body.field).toBe("description");

            const withdrawReq2 = {
                amount: 1,
                description: 123
            };

            const response2 = await request(app)
                .post("/api/v1/user/wallet/request-withdraw")
                .set("Cookie", `token=${token}`)
                .send(withdrawReq2);

            expect(response2.status).toBe(400);
            expect(response2.body.message).toBe("Description must be a string.");
            expect(response2.body.field).toBe("description");

            const withdrawReq3 = {
                amount: 1,
                description: ""
            };

            const response3 = await request(app)
                .post("/api/v1/user/wallet/request-withdraw")
                .set("Cookie", `token=${token}`)
                .send(withdrawReq3);

            expect(response3.status).toBe(400);
            expect(response3.body.message).toBe("Description must be at least 5 characters long.");
            expect(response3.body.field).toBe("description");


        });
    });
});