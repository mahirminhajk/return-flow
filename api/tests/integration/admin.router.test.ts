import request from "supertest";
import app from "../../src/api/app";
import { ADMIN_LOGIN, CREATE_ADMIN } from "../helpers/admin.helpers";
import { CREATE_USER, REQUEST_WITHDRAWAL, USER_LOGIN } from "../helpers/user.helpers";
import { TransactionLabel, TransactionsStatus, TransactionTypes } from "../../src/types";
import mongoose from "mongoose";
import { transactionAmountValidator } from "../../src/api/middlewares/validation/transaction.validation";

describe("Admin Router", () => {

    describe("POST /create-user", () => {
        it("should create a new user", async () => {
            const res = await ADMIN_LOGIN();
            const token = res.headers['set-cookie'][0].split('=')[1].split(';')[0];

            const newUser = {
                name: "Test User",
                phone: "919876543211",
                password: "password",
                invested: 1000,
                returnAmount: 200,
                investedDate: "2025-01-01"
            };

            const response = await request(app)
                .post("/api/v1/admin/create-user")
                .set("Cookie", `token=${token}`)
                .send(newUser);

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe("User created successfully.");
            expect(response.body.data).toHaveProperty("_id");
            expect(response.body.data.name).toBe(newUser.name);
            expect(response.body.data.phone).toBe(newUser.phone);
        });

        it("should creaet a new user and a new wallet", async () => {
            const res = await ADMIN_LOGIN();
            const token = res.headers['set-cookie'][0].split('=')[1].split(';')[0];

            const newUser = {
                name: "Test User 2",
                phone: "919876543212",
                password: "password",
                invested: 1000,
                returnAmount: 200,
                investedDate: "2025-01-01"
            };

            const response = await request(app)
                .post("/api/v1/admin/create-user")
                .set("Cookie", `token=${token}`)
                .send(newUser);

            expect(response.status).toBe(201);
            expect(response.body.data.wallet).toBeDefined();
        });

        it("should return error if user already exists", async () => {
            const res = await CREATE_USER("919876543211", "password");

            expect(res.status).toBe(400);
            expect(res.body.message).toBe("User already exists.");
        });

        it("should return error if required fields are missing", async () => {
            const res = await ADMIN_LOGIN();
            const token = res.headers['set-cookie'][0].split('=')[1].split(';')[0];

            const response = await request(app)
                .post("/api/v1/admin/create-user")
                .set("Cookie", `token=${token}`)
                .send({
                    name: "Test User",
                    phone: "919876543211",
                    invested: 1000,
                    returnAmount: 200,
                    investedDate: "2025-01-01"
                });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe("Password is required.");

            const response1 = await request(app)
                .post("/api/v1/admin/create-user")
                .set("Cookie", `token=${token}`)
                .send({
                    name: "Test User",
                    password: "123456789",
                    invested: 1000,
                    returnAmount: 200,
                    investedDate: "2025-01-01"
                });

            expect(response1.status).toBe(400);
            expect(response1.body.message).toBe("Phone is required.");

            const response2 = await request(app)
                .post("/api/v1/admin/create-user")
                .set("Cookie", `token=${token}`)
                .send({
                    phone: "919876543211",
                    password: "123456789",
                    invested: 1000,
                    returnAmount: 200,
                    investedDate: "2025-01-01"
                });

            expect(response2.status).toBe(400);
            expect(response2.body.message).toBe("Name is required.");

            const response3 = await request(app)
                .post("/api/v1/admin/create-user")
                .set("Cookie", `token=${token}`)
                .send({
                    name: "Test User",
                    phone: "85430",
                    password: "123456789",
                    invested: 1000,
                    returnAmount: 200,
                    investedDate: "2025-01-01"
                });

            expect(response3.status).toBe(400);
            expect(response3.body.message).toBe("Phone is invalid.");
        });

        it("should return error if investment fields are missing", async () => {
            const res = await ADMIN_LOGIN();
            const token = res.headers['set-cookie'][0].split('=')[1].split(';')[0];

            const response = await request(app)
                .post("/api/v1/admin/create-user")
                .set("Cookie", `token=${token}`)
                .send({
                    name: "Test User",
                    phone: "919876543212",
                    password: "password",
                    investedDate: "2025-01-01"
                });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe("Invested amount is required.");

            const response1 = await request(app)
                .post("/api/v1/admin/create-user")
                .set("Cookie", `token=${token}`)
                .send({
                    name: "Test User",
                    phone: "919876543212",
                    password: "password",
                    invested: 1000,
                    investedDate: "2025-01-01"
                });

            expect(response1.status).toBe(400);
            expect(response1.body.message).toBe("Return amount is required.");

            const response2 = await request(app)
                .post("/api/v1/admin/create-user")
                .set("Cookie", `token=${token}`)
                .send({
                    name: "Test User",
                    phone: "919876543212",
                    password: "password",
                    invested: 1000,
                    returnAmount: 200
                });

            expect(response2.status).toBe(400);
            expect(response2.body.message).toBe("Invested date is required.");

        });

        it("should return eror if investment field are invalid", async () => {
            const res = await ADMIN_LOGIN();
            const token = res.headers['set-cookie'][0].split('=')[1].split(';')[0];

            const response = await request(app)
                .post("/api/v1/admin/create-user")
                .set("Cookie", `token=${token}`)
                .send({
                    name: "Test User",
                    phone: "919876543212",
                    password: "password",
                    invested: "wrong-invested-value",
                    returnAmount: 200,
                    investedDate: "2025-01-01"
                });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe("Invested amount must be a number.");

            const response1 = await request(app)
                .post("/api/v1/admin/create-user")
                .set("Cookie", `token=${token}`)
                .send({
                    name: "Test User",
                    phone: "919876543212",
                    password: "password",
                    invested: -1000,
                    returnAmount: 200,
                    investedDate: "2025-01-01"
                });

            expect(response1.status).toBe(400);
            expect(response1.body.message).toBe("Invested amount must be greater than 0.");

            const response2 = await request(app)
                .post("/api/v1/admin/create-user")
                .set("Cookie", `token=${token}`)
                .send({
                    name: "Test User",
                    phone: "919876543212",
                    password: "password",
                    invested: 1000,
                    returnAmount: "wrong-returnAmount-value",
                    investedDate: "2025-01-01"
                });

            expect(response2.status).toBe(400);
            expect(response2.body.message).toBe("Return amount must be a number.");

            const response3 = await request(app)
                .post("/api/v1/admin/create-user")
                .set("Cookie", `token=${token}`)
                .send({
                    name: "Test User",
                    phone: "919876543212",
                    password: "password",
                    invested: 1000,
                    returnAmount: -200,
                    investedDate: "2025-01-01"
                });

            expect(response3.status).toBe(400);
            expect(response3.body.message).toBe("Return amount must be greater than 0.");

            const response4 = await request(app)
                .post("/api/v1/admin/create-user")
                .set("Cookie", `token=${token}`)
                .send({
                    name: "Test User",
                    phone: "919876543212",
                    password: "password",
                    invested: 1000,
                    returnAmount: 200,
                    investedDate: "wrong-date"
                });

            expect(response4.status).toBe(400);
            expect(response4.body.message).toBe("Invested date is invalid.");
        })

        it("should return error if admin is not authorized", async () => {
            const response = await request(app)
                .post("/api/v1/admin/create-user")
                .set("Cookie", `token=3`)
                .send({
                    name: "Test User",
                    phone: "919876543212",
                    password: "password",
                    invested: 1000,
                    returnAmount: 200,
                    investedDate: "2025-01-01"
                });

            expect(response.status).toBe(401);
            expect(response.body.message).toBe("Unauthorized, please login.");
        });

        it("should return error if user try to create user", async () => {
            const res = await USER_LOGIN();
            const token = res.headers['set-cookie'][0].split('=')[1].split(';')[0];

            const response = await request(app)
                .post("/api/v1/admin/create-user")
                .set("Cookie", `token=${token}`)
                .send({
                    name: "Test User",
                    phone: "919876543212",
                    password: "password",
                    invested: 1000,
                    returnAmount: 200,
                    investedDate: "2025-01-01"
                });

            expect(response.status).toBe(401);
            expect(response.body.message).toBe("Unauthorized, please login.");
        });
    });

    describe("POST /create-admin", () => {
        it("should create a new admin", async () => {
            const res = await ADMIN_LOGIN();
            const token = res.headers['set-cookie'][0].split('=')[1].split(';')[0];

            const newAdmin = {
                name: "Test Admin",
                phone: "919876543210",
                password: "password"
            };

            const response = await request(app)
                .post("/api/v1/admin/create-admin")
                .set("Cookie", `token=${token}`)
                .send(newAdmin);

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe("Admin created successfully.");
            expect(response.body.data).toHaveProperty("_id");
            expect(response.body.data.name).toBe(newAdmin.name);
            expect(response.body.data.phone).toBe(newAdmin.phone);
        });

        it("should return error if admin already exists", async () => {
            const res = await CREATE_ADMIN("919876543210", "password");
            expect(res.status).toBe(400);
            expect(res.body.message).toBe("Admin already exists.");
        });

        it("should return error if required fields are missing", async () => {
            const res = await ADMIN_LOGIN();
            const token = res.headers['set-cookie'][0].split('=')[1].split(';')[0];

            const response = await request(app)
                .post("/api/v1/admin/create-admin")
                .set("Cookie", `token=${token}`)
                .send({
                    name: "Test Admin",
                    phone: "919876543210"
                });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe("Password is required.");

            const response1 = await request(app)
                .post("/api/v1/admin/create-admin")
                .set("Cookie", `token=${token}`)
                .send({
                    name: "Test Admin",
                    password: "123456789"
                });

            expect(response1.status).toBe(400);
            expect(response1.body.message).toBe("Phone is required.");

            const response2 = await request(app)
                .post("/api/v1/admin/create-admin")
                .set("Cookie", `token=${token}`)
                .send({
                    phone: "919876543210",
                    password: "123456789"
                });

            expect(response2.status).toBe(400);
            expect(response2.body.message).toBe("Name is required.");

            const response3 = await request(app)
                .post("/api/v1/admin/create-admin")
                .set("Cookie", `token=${token}`)
                .send({
                    name: "Test Admin",
                    phone: "85430",
                    password: "123456789"
                });

            expect(response3.status).toBe(400);
            expect(response3.body.message).toBe("Phone is invalid.");
        });

        it("should return error if admin is not authorized", async () => {

            const response = await request(app)
                .post("/api/v1/admin/create-admin")
                .set("Cookie", `token=3`)
                .send({
                    name: "Test Admin",
                    phone: "919876543211",
                    password: "password"
                });

            expect(response.status).toBe(401);
            expect(response.body.message).toBe("Unauthorized, please login.");
        });

        it("should return error if user try to create admin", async () => {
            const res = await USER_LOGIN();
            const token = res.headers['set-cookie'][0].split('=')[1].split(';')[0];

            const response = await request(app)
                .post("/api/v1/admin/create-admin")
                .set("Cookie", `token=${token}`)
                .send({
                    name: "Test Admin",
                    phone: "919876543211",
                    password: "password"
                });

            expect(response.status).toBe(401);
            expect(response.body.message).toBe("Unauthorized, please login.");
        });
    });

    describe("PATCH /transaction/status", () => {
        it("should update the transaction status", async () => {

            //* request to create a new transaction
            const withdrawalRes = await REQUEST_WITHDRAWAL(10);
            const transactionId = withdrawalRes.body.data.transaction._id;

            const res = await ADMIN_LOGIN();
            const token = res.headers['set-cookie'][0].split('=')[1].split(';')[0];

            const response = await request(app)
                .patch("/api/v1/admin/transaction/status")
                .set("Cookie", `token=${token}`)
                .send({ transactionId, status: TransactionsStatus.ACCEPTED });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe("Transaction status updated successfully.");
        });

        it("should update the transaction status to 'ACCEPTED | REJECTED'", async () => {
            const withdrawalRes = await REQUEST_WITHDRAWAL(10);
            const transactionId = withdrawalRes.body.data.transaction._id;

            const res = await ADMIN_LOGIN();
            const token = res.headers['set-cookie'][0].split('=')[1].split(';')[0];

            const response = await request(app)
                .patch("/api/v1/admin/transaction/status")
                .set("Cookie", `token=${token}`)
                .send({ transactionId, status: TransactionsStatus.REJECTED });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe("Transaction status updated successfully.");
            expect(response.body.data.transaction.status).toBe("REJECTED");

            const response1 = await request(app)
                .patch("/api/v1/admin/transaction/status")
                .set("Cookie", `token=${token}`)
                .send({ transactionId, status: TransactionsStatus.ACCEPTED });

            expect(response1.status).toBe(200);
            expect(response1.body.success).toBe(true);
            expect(response1.body.message).toBe("Transaction status updated successfully.");
            expect(response1.body.data.transaction.status).toBe("ACCEPTED");
        });

        it("should return error if transaction not found", async () => {
            const res = await ADMIN_LOGIN();
            const token = res.headers['set-cookie'][0].split('=')[1].split(';')[0];
            const invalidTransactionId = new mongoose.Types.ObjectId();

            const response = await request(app)
                .patch("/api/v1/admin/transaction/status")
                .set("Cookie", `token=${token}`)
                .send({ transactionId: invalidTransactionId, status: TransactionsStatus.ACCEPTED });

            expect(response.status).toBe(404);
            expect(response.body.message).toBe("Transaction not found.");
        });

        it("should return error if transaction status is invalid", async () => {
            const withdrawalRes = await REQUEST_WITHDRAWAL(10);
            const transactionId = withdrawalRes.body.data.transaction._id;

            const res = await ADMIN_LOGIN();
            const token = res.headers['set-cookie'][0].split('=')[1].split(';')[0];

            const response = await request(app)
                .patch("/api/v1/admin/transaction/status")
                .set("Cookie", `token=${token}`)
                .send({ transactionId, status: "INVALID_STATUS" });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe("Status is invalid.");
            expect(response.body.field).toBe("status");

            const response1 = await request(app)
                .patch("/api/v1/admin/transaction/status")
                .set("Cookie", `token=${token}`)
                .send({ transactionId, status: "" });

            expect(response1.status).toBe(400);
            expect(response1.body.message).toBe("Status is required.");
            expect(response1.body.field).toBe("status");
        });

        it("should return error if admin is not authorized", async () => {
            const response = await request(app)
                .patch("/api/v1/admin/transaction/status")
                .set("Cookie", `token=3`)
                .send({ transactionId: new mongoose.Types.ObjectId(), status: TransactionsStatus.ACCEPTED });

            expect(response.status).toBe(401);
            expect(response.body.message).toBe("Unauthorized, please login.");
        });

        it("should return error if user try to update transaction status", async () => {
            const withdrawalRes = await REQUEST_WITHDRAWAL(10);
            const transactionId = withdrawalRes.body.data.transaction._id;

            const res = await USER_LOGIN();
            const token = res.headers['set-cookie'][0].split('=')[1].split(';')[0];

            const response = await request(app)
                .patch("/api/v1/admin/transaction/status")
                .set("Cookie", `token=${token}`)
                .send({ transactionId, status: TransactionsStatus.ACCEPTED });

            expect(response.status).toBe(401);
            expect(response.body.message).toBe("Unauthorized, please login.");
        });
    });

    describe("POST /transaction/add/:userId", () => {
        it("should create a new transaction", async () => {
            const newUserRes = await CREATE_USER("919876543213", "password");
            const userId = newUserRes.body.data._id;

            const res = await ADMIN_LOGIN();
            const token = res.headers['set-cookie'][0].split('=')[1].split(';')[0];

            const transaction = {
                type: TransactionTypes.CREDIT,
                amount: 100,
                label: TransactionLabel.INVESTMENT,
                description: "Test investment"
            };

            const response = await request(app)
                .post(`/api/v1/admin/transaction/add/${userId}`)
                .set("Cookie", `token=${token}`)
                .send(transaction);

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);

        });

        it("should create a new transactio and update user wallet balance", async () => {
            const newUserRes = await CREATE_USER("919876543214", "password");
            const userId = newUserRes.body.data._id;

            const res = await ADMIN_LOGIN();
            const token = res.headers['set-cookie'][0].split('=')[1].split(';')[0];

            const transaction1 = {
                type: TransactionTypes.CREDIT,
                amount: 100,
                label: TransactionLabel.INVESTMENT,
                description: "Test investment"
            }

            const response = await request(app)
                .post(`/api/v1/admin/transaction/add/${userId}`)
                .set("Cookie", `token=${token}`)
                .send(transaction1);

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.data.wallet.balance).toBe(1000 + transaction1.amount);

            const transaction2 = {
                type: TransactionTypes.DEBIT,
                amount: 500,
                label: TransactionLabel.SERVICE,
                description: "Test service charge"
            }

            const response1 = await request(app)
                .post(`/api/v1/admin/transaction/add/${userId}`)
                .set("Cookie", `token=${token}`)
                .send(transaction2);

            expect(response1.status).toBe(201);
            expect(response1.body.success).toBe(true);
            expect(response1.body.data.wallet.balance).toBe(1000 + transaction1.amount - transaction2.amount);
        });

        it("should create a new transaction and update the wallet transaction array", async () => {
            const newUserRes = await CREATE_USER("919876543215", "password");
            const userId = newUserRes.body.data._id;

            const res = await ADMIN_LOGIN();
            const token = res.headers['set-cookie'][0].split('=')[1].split(';')[0];

            const transaction1 = {
                type: TransactionTypes.CREDIT,
                amount: 100,
                label: TransactionLabel.INVESTMENT,
                description: "Test investment"
            }

            const response = await request(app)
                .post(`/api/v1/admin/transaction/add/${userId}`)
                .set("Cookie", `token=${token}`)
                .send(transaction1);

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.data.wallet.transactions.length).toBe(2);
            expect(response.body.data.wallet.transactions[0]).toBe(response.body.data.transaction._id);

            const transaction2 = {
                type: TransactionTypes.DEBIT,
                amount: 500,
                label: TransactionLabel.SERVICE,
                description: "Test service charge"
            }

            const response1 = await request(app)
                .post(`/api/v1/admin/transaction/add/${userId}`)
                .set("Cookie", `token=${token}`)
                .send(transaction2);

            expect(response1.status).toBe(201);
            expect(response1.body.success).toBe(true);
            expect(response1.body.data.wallet.transactions.length).toBe(3);
            expect(response1.body.data.wallet.transactions[0]).toBe(response1.body.data.transaction._id);
        });

        it("should return error if user not found", async () => {
            const res = await ADMIN_LOGIN();
            const token = res.headers['set-cookie'][0].split('=')[1].split(';')[0];

            const response = await request(app)
                .post(`/api/v1/admin/transaction/add/${new mongoose.Types.ObjectId()}`)
                .set("Cookie", `token=${token}`)
                .send({
                    type: TransactionTypes.CREDIT,
                    amount: 100,
                    label: TransactionLabel.INVESTMENT,
                    description: "Test investment"
                });

            expect(response.status).toBe(404);
            expect(response.body.message).toBe("User not found.");
        });

        it("should return error if user id is invalid", async () => {
            const res = await ADMIN_LOGIN();
            const token = res.headers['set-cookie'][0].split('=')[1].split(';')[0];

            const response = await request(app)
                .post(`/api/v1/admin/transaction/add/invalid-user-id`)
                .set("Cookie", `token=${token}`)
                .send({
                    type: TransactionTypes.CREDIT,
                    amount: 100,
                    label: TransactionLabel.INVESTMENT,
                    description: "Test investment"
                });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe("User ID is invalid.");
        });

        it("should return error if required fields are missing", async () => {
            const newUserRes = await CREATE_USER("919876543216", "password");
            const userId = newUserRes.body.data._id;

            const res = await ADMIN_LOGIN();
            const token = res.headers['set-cookie'][0].split('=')[1].split(';')[0];

            const response = await request(app)
                .post(`/api/v1/admin/transaction/add/${userId}`)
                .set("Cookie", `token=${token}`)
                .send({
                    type: TransactionTypes.CREDIT,
                    amount: 100,
                    label: TransactionLabel.INVESTMENT
                });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe("Description is required.");

            const response1 = await request(app)
                .post(`/api/v1/admin/transaction/add/${userId}`)
                .set("Cookie", `token=${token}`)
                .send({
                    type: TransactionTypes.CREDIT,
                    amount: 100,
                    description: "Test investment"
                });

            expect(response1.status).toBe(400);
            expect(response1.body.message).toBe("Label is required.");

            const response2 = await request(app)
                .post(`/api/v1/admin/transaction/add/${userId}`)
                .set("Cookie", `token=${token}`)
                .send({
                    type: TransactionTypes.CREDIT,
                    label: TransactionLabel.INVESTMENT,
                    description: "Test investment"
                });

            expect(response2.status).toBe(400);
            expect(response2.body.message).toBe("Amount is required.");

            const response3 = await request(app)
                .post(`/api/v1/admin/transaction/add/${userId}`)
                .set("Cookie", `token=${token}`)
                .send({
                    amount: 100,
                    label: TransactionLabel.INVESTMENT,
                    description: "Test investment"
                });

            expect(response3.status).toBe(400);
            expect(response3.body.message).toBe("Type is required.");
        });

        it("should return error if transaction fields are invalid", async () => {
            const newUserRes = await CREATE_USER("919876543217", "password");
            const userId = newUserRes.body.data._id;

            const res = await ADMIN_LOGIN();
            const token = res.headers['set-cookie'][0].split('=')[1].split(';')[0];

            const response = await request(app)
                .post(`/api/v1/admin/transaction/add/${userId}`)
                .set("Cookie", `token=${token}`)
                .send({
                    type: "INVALID_TYPE",
                    amount: 100,
                    label: TransactionLabel.INVESTMENT,
                    description: "Test investment"
                });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe("Invalid transaction type.");

            const response1 = await request(app)
                .post(`/api/v1/admin/transaction/add/${userId}`)
                .set("Cookie", `token=${token}`)
                .send({
                    type: TransactionTypes.CREDIT,
                    amount: "wrong-amount",
                    label: TransactionLabel.INVESTMENT,
                    description: "Test investment"
                });

            expect(response1.status).toBe(400);
            expect(response1.body.message).toBe("Amount must be a number.");

            const response2 = await request(app)
                .post(`/api/v1/admin/transaction/add/${userId}`)
                .set("Cookie", `token=${token}`)
                .send({
                    type: TransactionTypes.CREDIT,
                    amount: -100,
                    label: TransactionLabel.INVESTMENT,
                    description: "Test investment"
                });

            expect(response2.status).toBe(400);
            expect(response2.body.message).toBe("Amount must be greater than 0.");

            const response3 = await request(app)
                .post(`/api/v1/admin/transaction/add/${userId}`)
                .set("Cookie", `token=${token}`)
                .send({
                    type: TransactionTypes.CREDIT,
                    amount: 100,
                    label: "INVALID_LABEL",
                    description: "Test investment"
                });

            expect(response3.status).toBe(400);
            expect(response3.body.message).toBe("Invalid transaction label.");

            const response4 = await request(app)
                .post(`/api/v1/admin/transaction/add/${userId}`)
                .set("Cookie", `token=${token}`)
                .send({
                    type: TransactionTypes.CREDIT,
                    amount: 100,
                    label: TransactionLabel.INVESTMENT,
                    description: "Test"
                });

            expect(response4.status).toBe(400);
            expect(response4.body.message).toBe("Description must be at least 5 characters long.");
        });

        it("should return error if admin is not authorized", async () => {
            const response = await request(app)
                .post(`/api/v1/admin/transaction/add/${new mongoose.Types.ObjectId()}`)
                .set("Cookie", `token=3`)
                .send({
                    type: TransactionTypes.CREDIT,
                    amount: 100,
                    label: TransactionLabel.INVESTMENT,
                    description: "Test investment"
                });

            expect(response.status).toBe(401);
            expect(response.body.message).toBe("Unauthorized, please login.");
        });

        it("should return error if user try to create transaction", async () => {
            const newUserRes = await CREATE_USER("919876543218", "password");
            const userId = newUserRes.body.data._id;

            const res = await USER_LOGIN();
            const token = res.headers['set-cookie'][0].split('=')[1].split(';')[0];

            const response = await request(app)
                .post(`/api/v1/admin/transaction/add/${userId}`)
                .set("Cookie", `token=${token}`)
                .send({
                    type: TransactionTypes.CREDIT,
                    amount: 100,
                    label: TransactionLabel.INVESTMENT,
                    description: "Test investment"
                });

            expect(response.status).toBe(401);
            expect(response.body.message).toBe("Unauthorized, please login.");
        });
    });

    describe("DELETE /transaction/remove/:transactionId", () => {
        it("should delete a transaction", async () => {
            const withdrawalRes = await REQUEST_WITHDRAWAL(10);
            const transactionId = withdrawalRes.body.data.transaction._id;

            const res = await ADMIN_LOGIN();
            const token = res.headers['set-cookie'][0].split('=')[1].split(';')[0];

            const response = await request(app)
                .delete(`/api/v1/admin/transaction/remove/${transactionId}`)
                .set("Cookie", `token=${token}`);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe("Transaction deleted successfully.");
        });

        it("should delete a transaction and update user wallet balance", async () => {
            const newUserRes = await CREATE_USER("919876543219", "password");
            const userId = newUserRes.body.data._id;

            const transaction = {
                type: TransactionTypes.CREDIT,
                amount: 100,
                label: TransactionLabel.INVESTMENT,
                description: "Test investment"
            };

            const res = await ADMIN_LOGIN();
            const token = res.headers['set-cookie'][0].split('=')[1].split(';')[0];

            //*  add new transaction
            const transactionRes = await request(app)
                .post(`/api/v1/admin/transaction/add/${userId}`)
                .set("Cookie", `token=${token}`)
                .send(transaction);

            const transactionId = transactionRes.body.data.transaction._id;

            //* delete the transaction
            const response = await request(app)
                .delete(`/api/v1/admin/transaction/remove/${transactionId}`)
                .set("Cookie", `token=${token}`);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe("Transaction deleted successfully.");
            expect(response.body.data.wallet.balance).toBe(1000);
        });

        it("should return error if transaction not found", async () => {
            const res = await ADMIN_LOGIN();
            const token = res.headers['set-cookie'][0].split('=')[1].split(';')[0];
            const invalidTransactionId = new mongoose.Types.ObjectId();

            const response = await request(app)
                .delete(`/api/v1/admin/transaction/remove/${invalidTransactionId}`)
                .set("Cookie", `token=${token}`);

            expect(response.status).toBe(404);
            expect(response.body.message).toBe("Transaction not found.");
        });

        it("should return error if admin is not authorized", async () => {
            const response = await request(app)
                .delete(`/api/v1/admin/transaction/remove/${new mongoose.Types.ObjectId()}`)
                .set("Cookie", `token=3`);

            expect(response.status).toBe(401);
            expect(response.body.message).toBe("Unauthorized, please login.");
        });

        it("should return error if user try to delete transaction", async () => {
            const withdrawalRes = await REQUEST_WITHDRAWAL(10);
            const transactionId = withdrawalRes.body.data.transaction._id;

            const res = await USER_LOGIN();
            const token = res.headers['set-cookie'][0].split('=')[1].split(';')[0];

            const response = await request(app)
                .delete(`/api/v1/admin/transaction/remove/${transactionId}`)
                .set("Cookie", `token=${token}`);

            expect(response.status).toBe(401);
            expect(response.body.message).toBe("Unauthorized, please login.");
        });
    });
});