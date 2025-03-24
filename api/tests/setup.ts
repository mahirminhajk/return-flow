import { MongoMemoryServer, } from "mongodb-memory-server";
import mongoose from "mongoose";

import { AdminService } from "../src/services/admin.service";
import { UserService } from "../src/services/user.service";

let mongoServer: any;

beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    process.env.CLIENT_URL = 'http://localhost:5173';
    process.env.JWT_SECRET_ADMIN = 'secret'
    process.env.JWT_EXPIRES_IN_ADMIN = '1d'
    process.env.JWT_SECRET_USER = 'secret'
    process.env.JWT_EXPIRES_IN_USER = '1d'

    //* mongodb-memory-server
    mongoServer = await MongoMemoryServer.create();
    const mongodUri = mongoServer.getUri();
    await mongoose.connect(mongodUri, { dbName: "returnFlowTest" });

    //* create test admin and user for testing
    const admin = await AdminService.createAdmin({ name: "testAdmin", phone: "918086009808", password: "123456789" });
    const user = await UserService.createUser({ name: "testUser", phone: "917293338400", password: "123456789", invested: 1000, investedDate: new Date("2025-01-01"), returnAmount: 200 }, admin?._id as mongoose.Types.ObjectId);

    //* dummy data for testing
    process.env.ADMIN_ID = admin?._id as string;
    process.env.USER_ID = user?._id as string;
    process.env.ADMIN_PHONE = admin?.phone as string;
    process.env.USER_PHONE = user?.phone as string;
    process.env.ADMIN_PASSWORD = "123456789";
    process.env.USER_PASSWORD = "123456789";
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});