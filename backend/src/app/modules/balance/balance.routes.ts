import { Router } from "express";
const BalanceRouter = Router();

import { getBalance } from "./balance.controller.js";
import { GetUserMiddleware } from "../../core/middlewares/user.middleware.js";

/**
 * @route GET /api/balance
 * @description Get the current balance for the authenticated user
 * @returns { message: string, data: { balance: number } }
 */
BalanceRouter.get("/", GetUserMiddleware, getBalance);

export default BalanceRouter;