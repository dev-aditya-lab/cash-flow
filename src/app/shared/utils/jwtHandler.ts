import jwt from "jsonwebtoken";
import config from "../../config/env.config.js";

export const generateToken = (tokenData: object) => {
	try {
		const token = jwt.sign(tokenData, config.jwtSecret, {
			expiresIn: config.jwtExpiry,
		} as jwt.SignOptions);
		return token;
	} catch (error) {
		if (config.nodeEnv === "development") {
			console.error("Error generating token:", error);
		}
		throw new Error("Token generation failed");
	}
};

export const verifyToken = (token: string) => {
	try {
		const decoded = jwt.verify(token, config.jwtSecret);
		return decoded;
	} catch (error) {
		if (config.nodeEnv === "development") {
			console.error("Error verifying token:", error);
		}
		throw new Error("Token verification failed");
	}
};
