import type { Request } from "express";
import { generateToken,verifyToken } from "./jwtHandler.js";
import redisClient from "../../config/redis.config.js";

const key = "secure-account:";

export const generateSecureAccountUrl = async (req: Request, userId: string) => {
	const protocol = req.protocol;
	const host = req.get("host");
	const token = generateToken({ userId }, "10m"); // Token valid for 10 minutes
    await redisClient.setEx(`${key}${token}`, 600, userId); // Store token in Redis with a TTL of 10 minutes
	return `${protocol}://${host}/api/auth/secure-account?token=${token}`;
};

export const verifySecureAccountUrl = async (req: Request, userId: string) => {
    const token = req.query.token as string;
    if (!token) {
        return false;
    }
    const decoded = verifyToken(token);
    if (!decoded) {
        return false;
    }
    if (decoded.userId !== userId) {
        return false;
    }
    const storedUserId = await redisClient.get(`${key}${token}`);
    if (!storedUserId) {
        return false;
    }
    return true;
}


