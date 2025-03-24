import request from "supertest";
import app from "../../src/api/app";
import { ADMIN_LOGIN } from "./admin.helpers";

export const USER_LOGIN = (phone?: string, password?: string) => {
    if (!phone) phone = process.env.USER_PHONE;
    if (!password) password = process.env.USER_PASSWORD;

    const res = request(app)
        .post("/api/v1/auth/login/user")
        .send({ phone, password });

    return res;
};

export const CREATE_USER = async (phone: string, password: string) => {
    const res = await ADMIN_LOGIN();
    const token = res.headers['set-cookie'][0].split('=')[1].split(';')[0];

    const newUser = {
        name: "Test User",
        phone,
        password,
        invested: 1000,
        returnAmount: 200,
        investedDate: "2025-01-01"
    };

    const response = await request(app)
        .post("/api/v1/admin/create-user")
        .set("Cookie", `token=${token}`)
        .send(newUser);

    return response;
};

export const REQUEST_WITHDRAWAL = async (amount: number) => {
    const res = await USER_LOGIN();
    const token = res.headers['set-cookie'][0].split('=')[1].split(';')[0];

    const response = await request(app)
        .post("/api/v1/user/wallet/request-withdraw")
        .set("Cookie", `token=${token}`)
        .send({ amount, description: "Test withdraw request" });

    return response;
};