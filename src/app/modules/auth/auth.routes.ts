import { Router } from "express";
import {  loginUserController, logoutUserController, registerUserController, reSendVerificationEmailController, verifyEmailController, verifyOtpController } from "./auth.controller.js";
const authRouter = Router();

/** 
 * @route POST api/auth/register
 * @desc Register a new user
 * @access Public
 * @body { name: string, email: string, password: string }
 * @response { success: boolean, message: string, data: object | null }
 */
authRouter.post("/register",registerUserController);

/** 
 * @route GET api/auth/verify-email?token=...
 * @desc Verify user's email address
 * @access Public
 * @query { token: string }
 * @response { success: boolean, message: string }
 */
authRouter.get("/verify-email", verifyEmailController);

/** 
 * @route POST api/auth/resend-verification-email
 * @desc Resend email verification link
 * @access Public
 * @body { email: string }
 * @response { success: boolean, message: string }
 */
authRouter.post("/resend-verification-email", reSendVerificationEmailController);

/** 
 * @route POST api/auth/verify-otp
 * @desc Verify user's OTP
 * @access Public
 * @body { email: string, otp: string }
 * @response { success: boolean, message: string }
 */
authRouter.post("/verify-otp", verifyOtpController);

/** 
 * @route POST api/auth/login
 * @desc Login a user
 * @access Public
 * @body { email: string, password: string }
 * @response { success: boolean, message: string, data: object | null }
 */
authRouter.post("/login", loginUserController);

/** 
 * @route POST api/auth/logout
 * @desc Logout a user
 * @access Public
 * @response { success: boolean, message: string }
 */
authRouter.post("/logout", logoutUserController);

export default authRouter;
