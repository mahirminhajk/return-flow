import request from "supertest";
import app from "../../src/api/app";

export const ADMIN_LOGIN = (phone?: string, password?: string) => {
    if (!phone) phone = process.env.ADMIN_PHONE;
    if (!password) password = process.env.ADMIN_PASSWORD;

    const res = request(app)
        .post("/api/v1/auth/login/admin")
        .send({ phone, password });

    return res;
};

export const CREATE_ADMIN = async (phone: string, password: string) => {
    const res = await ADMIN_LOGIN();
    const token = res.headers['set-cookie'][0].split('=')[1].split(';')[0];

    const newAdmin = {
        name: "Test Admin",
        phone,
        password
    };

    const response = await request(app)
        .post("/api/v1/admin/create-admin")
        .set("Cookie", `token=${token}`)
        .send(newAdmin);

    return response;
};