import type { NextFunction, Request, Response } from "express";
import sendError from "../response/error.response.js";
import type { DecodedToken } from "../../shared/utils/jwtHandler.js";
import AuthModel from "../../modules/auth/auth.schema.js";

/**
 * AdminMiddleware — must run AFTER GetUserMiddleware (which attaches req.user).
 *
 * Intentionally reads the role from the DB (not the JWT payload) so that
 * role changes take effect immediately without requiring a new login token.
 */
export const AdminMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const decoded = (req as Request & { user?: DecodedToken }).user;
		if (!decoded?.userId) {
			sendError(res, 401, "Unauthorized", null);
			return;
		}

		const user = await AuthModel.findById(decoded.userId).select("role").lean();
		if (!user || user.role !== "admin") {
			sendError(res, 403, "Forbidden: Admin access only", null);
			return;
		}

		next();
	} catch {
		sendError(res, 500, "Internal server error", null);
	}
};
