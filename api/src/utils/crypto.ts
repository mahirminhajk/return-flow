import { randomInt } from "node:crypto";

export const generateSixDigitRanNumber = (): number => {
    return randomInt(100000, 999999);
};