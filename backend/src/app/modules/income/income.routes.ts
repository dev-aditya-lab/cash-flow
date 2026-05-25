import { Router } from "express";
const incomeRouter = Router();
import { addIncome, deleteIncome, getIncomes, updateIncome } from "./income.controller.js";
import { GetUserMiddleware } from "../../core/middlewares/user.middleware.js";

/**
 * @route POST /api/incomes/add
 * @description Add a new income for the authenticated user
 * @body { amount: number, mode: string, from: string, description?: string, date?: Date }
 * @returns { message: string, income: object }
 */
incomeRouter.post("/add", GetUserMiddleware, addIncome);

/**
 * @route GET /api/incomes
 * @description Retrieve all incomes for the authenticated user
 * @returns { message: string, incomes: object[] }
 */
incomeRouter.get("/", GetUserMiddleware, getIncomes);

/**
 * @route PUT /api/incomes/:id
 * @description Update an existing income for the authenticated user
 * @param {string} id - The ID of the income to update
 * @body { amount?: number, mode?: string, from?: string, description?: string, date?: Date }
 * @returns { message: string, income: object }
 */
incomeRouter.put("/edit/:incomeId", GetUserMiddleware, updateIncome);

/**
 * @route DELETE /api/incomes/:id
 * @description Delete an existing income for the authenticated user
 * @param {string} id - The ID of the income to delete
 * @returns { message: string }
 */
incomeRouter.delete("/delete/:incomeId", GetUserMiddleware, deleteIncome);

export default incomeRouter;