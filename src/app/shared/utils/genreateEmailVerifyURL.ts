import { generateToken } from "./jwtHandler.js";

export const generateEmailVerificationToken= (email: string): string => {
    const tokenData = { email };
    const token = generateToken(tokenData, "10m"); // Token valid for 10 minutes
    return token;
};