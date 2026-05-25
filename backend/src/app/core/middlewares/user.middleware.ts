import type { NextFunction, Request, Response } from "express";
import {
	verifyToken,
	type DecodedToken,
} from "../../shared/utils/jwtHandler.js";
import sendError from "../response/error.response.js";

export const GetUserMiddleware = (
	req: Request,
	res: Response,
	next: NextFunction,
): void => {
	const token = req.cookies.cash_flow_token;
	if (!token) {
        sendError(res, 401, "Unauthorized", null);
		return;
	}
	const decoded = verifyToken(token);
	if (!decoded) {
		sendError(res, 401, "Unauthorized", null);
		return;
	}
	(req as Request & { user?: unknown }).user = decoded as DecodedToken; // Attach decoded token data to request object
	next();
};
