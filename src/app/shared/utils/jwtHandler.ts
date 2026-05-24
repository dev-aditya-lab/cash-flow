import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
const { TokenExpiredError, JsonWebTokenError } = jwt;

import config from "../../config/env.config.js";

export const generateToken = (tokenData: object, expiry?: string) => {
	try {
		const token = jwt.sign(tokenData, config.jwtSecret, {
			expiresIn: expiry || config.jwtExpiry,
		} as jwt.SignOptions);
		return token;
	} catch (error) {
		if (config.nodeEnv === "development") {
			console.error("Error generating token:", error);
		}
		throw new Error("Token generation failed");
	}
};


export interface DecodedToken extends JwtPayload {
  userId: string;
  email: string;
  role: string;
  // add your custom claims here
}

export const verifyToken = (token: string): DecodedToken => {
  try {
    const decoded = jwt.verify(token, config.jwtSecret);

    if (typeof decoded === "string") {
      throw new Error("Unexpected token format");
    }

    return decoded as DecodedToken;
  } catch (error) {
    if (config.nodeEnv === "development") {
      console.error("Token verification failed:", (error as Error).message);
    }

    if (error instanceof TokenExpiredError) {
      throw new Error("Token has expired");
    }

    if (error instanceof JsonWebTokenError) {
      throw new Error("Invalid token");
    }

    throw new Error("Token verification failed");
  }
};
