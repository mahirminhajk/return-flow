import { Admin } from "../../models/Admin";
import { hashPassword } from "../../utils";


export const initialAdmin = async () => {
    const phone = "911234567890";
    const admin = await Admin.findOne({ phone });
    if (!admin) {
        const password = await hashPassword("123456789");
        await Admin.create({ phone, password, name: "Admin" });

        console.log("✅ Initial Admin created successfully");
    };

    console.log("🟧 Login with phone: 911234567890 and password: 123456789");
};
    