import { Router } from "express";
import { getReport } from "./report.controller.js";
import { GetUserMiddleware } from "../../core/middlewares/user.middleware.js";
const reportRouter = Router();

/**
 * @route POST /api/report/get
 * @desc Get report from users
 * @access Private
 */
reportRouter.post("/get", GetUserMiddleware,getReport);

export default reportRouter;