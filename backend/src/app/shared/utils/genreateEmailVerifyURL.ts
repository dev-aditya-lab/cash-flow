import { generateToken } from "./jwtHandler.js";
import type { Request } from "express";

export const generateEmailVerificationURL = (req: Request, email: string): string => {
	const tokenData = { email };
	const token = generateToken(tokenData, "10m"); // Token valid for 10 minutes
	const verificationLink = `${req.protocol}://${req.host}/api/auth/verify-email?token=${token}`;
	return verificationLink;
};
