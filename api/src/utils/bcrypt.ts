import bcrypt from "bcryptjs";

export const hashPassword = (password: string): string => {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    return hashedPassword;
};

export const comparePassword = (password: string, hashedPassword: string): boolean => {
    return bcrypt.compareSync(password, hashedPassword);
};

export const hashOTP = (otp: number): string => {
    const salt = bcrypt.genSaltSync(5);
    const hashedOTP = bcrypt.hashSync(otp.toString(), salt);
    return hashedOTP;
};

export const compareOTP = (otp: string, hashedOTP: string): boolean => {
    return bcrypt.compareSync(otp, hashedOTP);
};