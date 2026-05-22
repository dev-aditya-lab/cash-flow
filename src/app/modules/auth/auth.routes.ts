import { Router } from "express";
import { registerUserController } from "./auth.controller.js";
const authRouter = Router();

/*
 * @route POST api/auth/register
 * @desc Register a new user
 * @access Public
 * @body { name: string, email: string, password: string }
 * @response { success: boolean, message: string, data: object | null }
 */
authRouter.post("/register",registerUserController);


export default authRouter;
