import { Router } from "express";
import { getFeedback } from "./feedback.controller.js";
import { GetUserMiddleware } from "../../core/middlewares/user.middleware.js";
const feedbackRouter = Router();

/**
 * @route POST /api/feedback/get
 * @desc Get feedback from users
 * @access Private
 */
feedbackRouter.post("/get", GetUserMiddleware,getFeedback);

export default feedbackRouter;