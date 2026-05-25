import type { NextFunction, Request, Response } from "express";
import { verifyToken, type DecodedToken } from "../../shared/utils/jwtHandler.js";

export const checkUserMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.cookies.cash_flow_token;
    if (!token) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return;
    }
    const decoded = verifyToken(token);
    if (!decoded) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return;
    }
    (req as Request & { user?: unknown }).user = decoded as DecodedToken; // Attach decoded token data to request object
    next();
}