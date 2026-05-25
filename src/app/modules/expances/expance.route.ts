import { Router } from "express";
import { GetUserMiddleware } from "../../core/middlewares/user.middleware.js";
import { addExpance, deleteExpance, getExpances, updateExpance } from "./expance.controller.js";
const expanceRouter = Router();

/**
 * @route POST /api/expance/add
 * @desc Add a new expance
 * @access Private
 * @body { amount: number, mode: string, to: string, resion: string, description?: string, date?: Date }
 * @returns { message: string, expance: object }
 */
expanceRouter.post("/add",GetUserMiddleware ,addExpance);

/**
 * @route GET /api/expance
 * @desc Get all expances for the authenticated user
 * @access Private
 * @returns { message: string, expances: array }
 */
expanceRouter.get("/", GetUserMiddleware, getExpances);

/**
 * @route DELETE /api/expance/delete/:id
 * @desc Delete an expance for the authenticated user
 * @access Private
 * @param {string} id - The ID of the expance to delete
 * @returns { message: string, expance: object }
 */
expanceRouter.delete("/delete/:id", GetUserMiddleware, deleteExpance);

/**
 * @route PUT /api/expance/edit/:id
 * @desc Update an expance for the authenticated user
 * @access Private
 * @body { amount?: number, mode?: string, to?: string, resion?: string, description?: string, date?: Date }
 * @returns { message: string, expance: object }
 */
expanceRouter.put("/edit/:id", GetUserMiddleware, updateExpance);

export default expanceRouter;