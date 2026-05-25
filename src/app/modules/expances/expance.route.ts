import { Router } from "express";
import { GetUserMiddleware } from "../../core/middlewares/user.middleware.js";
import { addExpance } from "./expance.controller.js";
const expanceRouter = Router();

/**
 * @route POST /api/expance/add
 * @desc Add a new expance
 * @access Private
 * @body { amount: number, mode: string, to: string, resion: string, description?: string, date?: Date }
 * @returns { message: string, expance: object }
 */
expanceRouter.post("/add",GetUserMiddleware ,addExpance);

export default expanceRouter;