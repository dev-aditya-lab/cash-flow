import { Router } from "express";
import {
	changePasswordController,
	getMeController,
	loginUserController,
	logoutUserController,
	registerUserController,
	reSendVerificationEmailController,
	requestAccountDeletionController,
	verifyEmailController,
	verifyOtpController,
} from "./auth.controller.js";
import { checkUserMiddleware } from "./auth.middleware.js";
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
 * @route POST api/auth/change-password
 * @desc Change user's password
 * @access Private
 * @body { email: string, oldPassword: string, newPassword: string }
 * @response { success: boolean, message: string }
 */
authRouter.post("/change-password", checkUserMiddleware, changePasswordController);

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
 * @route GET api/auth/me
 * @desc Get currently authenticated user's profile (always fresh from DB)
 * @access Private
 * @response { success: boolean, message: string, data: User }
 */
authRouter.get("/me", checkUserMiddleware, getMeController);

/**
 * @route POST api/auth/logout
 * @desc Logout a user
 * @access Public
 * @response { success: boolean, message: string }
 */
authRouter.post("/logout", logoutUserController);

/**
 * @route POST api/auth/request-account-deletion
 * @desc Schedule the account for permanent deletion in 30 days and send a confirmation email.
 *       Public — required by Google Play Store policy.
 * @access Public
 * @body { email: string }
 * @response { success: boolean, message: string }
 */
authRouter.post("/request-account-deletion", requestAccountDeletionController);

export default authRouter;
