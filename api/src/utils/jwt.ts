import jwt from "jsonwebtoken";

export const generateUserToken = (payload: { _id: string, phone: string }): string => {
    return jwt.sign(payload, process.env.JWT_SECRET_USER!, { expiresIn: process.env.JWT_EXPIRES_IN_USER });
};

export const verifyUserToken = (token: string): { _id: string, phone: string } | null => {
    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET_USER!);
        if (typeof decode === "object" && decode.hasOwnProperty("_id") && decode.hasOwnProperty("phone")) {
            return { _id: decode._id, phone: decode.phone };
        }
        return null;
    } catch (error) {
        return null;
    }
};

export const generateAdminToken = (payload: { _id: string, phone: string }): string => {
    return jwt.sign({
        ...payload,
        admin: true
    }, process.env.JWT_SECRET_ADMIN!, { expiresIn: process.env.JWT_EXPIRES_IN_ADMIN });
};

export const verifyAdminToken = (token: string): { _id: string, phone: string, admin: boolean } | null => {
    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET_ADMIN!);

        if (typeof decode === "object" && decode.hasOwnProperty("_id") && decode.hasOwnProperty("phone") && decode.hasOwnProperty("admin")) {
            return { _id: decode._id, phone: decode.phone, admin: decode.admin };
        }
        return null;
    } catch (error) {
        return null;
    }
};
