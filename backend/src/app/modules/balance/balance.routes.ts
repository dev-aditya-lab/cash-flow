import { Router } from "express";
const BalanceRouter = Router();

import { getBalance } from "./balance.controller.js";

/**
 * @route GET /api/balance
 * @description Get the current balance for the authenticated user
 * @returns { message: string, data: { balance: number } }
 */
BalanceRouter.get("/", getBalance);

export default BalanceRouter;