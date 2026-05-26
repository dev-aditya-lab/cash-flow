import sendRes from "../../core/response/sucess.response.js";
import AuthModel from "./auth.schema.js";
import type { Request, RequestHandler, Response } from "express";
import type { RegisterUserRequest } from "./auth.types.js";
import sendError from "../../core/response/error.response.js";
import { generateToken, verifyToken, type DecodedToken } from "../../shared/utils/jwtHandler.js";
import { clearCookie, setCookie } from "../../shared/utils/setCookies.js";
import sendMail from "../../shared/utils/sendMail.service.js";
import { generateOtp } from "../../shared/utils/genreateOtp.service.js";
import { authEmail } from "../../core/constent/constent.js";
import { OTP_EMAIL_TEMPLATE } from "../../shared/services/mail/emailTemplate/otp.emailTemplate.js";
import { generateEmailVerificationURL } from "../../shared/utils/genreateEmailVerifyURL.js";
import config from "../../config/env.config.js";
import { saveOtp, verifyOtp } from "../../shared/utils/otpHandlers.js";
import { LOGIN_ALERT_EMAIL_TEMPLATE } from "../../shared/services/mail/emailTemplate/login-alert.emailTemplate.js";

interface ExtendedRequest extends Request {
	timestamp: string;
	deviceInfo: string;
	location: string;
}

/** 
 * @controller registerUserController
 * @description Register a new user and send OTP for email verification
 * @body { name: string, email: string, password: string }
 * @returns { message: string, user: object }
 */
export const registerUserController: RequestHandler = async (
	req,
	res,
): Promise<void> => {
	try {
		const extendedReq = req as ExtendedRequest;
		const { name, email, password } = req.body as RegisterUserRequest;
		const isUserExist = await AuthModel.findOne({ email });
		if (isUserExist) {
			sendError(res, 400, "User already exists", null);
			return;
		}
		try {
			const createdUser = await AuthModel.create({
				name,
				email,
				password,
			});
			const otp = generateOtp(6);
			const verificationLink = generateEmailVerificationURL(req, email);
			await saveOtp(email, otp);
			try {
				await sendMail(
					authEmail,
					createdUser.email,
					"Welcome to CashFlow! Your OTP Code",
					OTP_EMAIL_TEMPLATE(
						otp,
						extendedReq.timestamp,
						extendedReq.ip ?? "",
						extendedReq.headers["user-agent"] ?? "",
						extendedReq.location ?? "Unknown Location",
						verificationLink,
					),
				);
				sendRes(
					res,
					201,
					"Otp sent successfully on " + createdUser.email,
					null,
				);
			} catch (error) {
				if (error instanceof Error) {
					sendError(res, 400, error.message, null);
				} else {
					sendError(res, 400, "Failed to send OTP email", null);
				}
			}
			const { password: _, ...userWithoutPassword } =
				createdUser.toObject();
			sendRes(
				res,
				201,
				"User registered successfully",
				userWithoutPassword,
			);
		} catch (error) {
			if (error instanceof Error) {
				sendError(res, 400, error.message, null);
			} else {
				sendError(res, 400, "User registration failed", null);
			}
		}
	} catch (error) {
		sendError(res, 500, "Internal server error", null);
	}
};

/**
 * @controller verifyEmailController
 * @description Verify user's email using the token sent in the verification email
 * @query { token: string }
 * @returns { message: string, decoded: object }
 */
export const verifyEmailController = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const { token } = req.query as { token: string };
		const decoded = verifyToken(token);
		const user = await AuthModel.findOne({ email: decoded.email });
		if (!user) {
			sendError(res, 400, "Invalid token", null);
			return;
		}
		user.emailVerified = true;
		await user.save();
		res.redirect(config.frontendUrl + "/login");
		sendRes(res, 200, "Email verified successfully", {userEmail: user.email});
	} catch (error) {
		sendError(res, 400, "Invalid token", null);
	}
};

/**
 * @controller reSendVerificationEmailController
 * @description Resend the email verification OTP to the user's email
 * @body { email: string }
 * @returns { message: string }
 */
export const reSendVerificationEmailController: RequestHandler = async (
	req,
	res,
): Promise<void> => {
	try {
		const extendedReq = req as ExtendedRequest;
		const { email } = req.body as RegisterUserRequest;
		const isUserExist = await AuthModel.findOne({ email });
		if (!isUserExist) {
			sendError(res, 400, "User not found with the provided email", null);
			return;
		}
		if (isUserExist.isBanned) {
			sendError(
				res,
				403,
				"Your account has been banned. Please contact support.",
				null,
			);
			return;
		}
		if (isUserExist.emailVerified) {
			sendError(res, 400, "Email is already verified", null);
			return;
		}
		try {
			const otp = generateOtp(6);
			const verificationLink = generateEmailVerificationURL(req, email);
			await saveOtp(email, otp);
			try {
				await sendMail(
					authEmail,
					isUserExist.email,
					"Welcome back to CashFlow! Your OTP Code",
					OTP_EMAIL_TEMPLATE(
						otp,
						extendedReq.timestamp,
						extendedReq.ip ?? "",
						extendedReq.deviceInfo,
						extendedReq.location,
						verificationLink,
					),
				);
			} catch (error) {
				if (error instanceof Error) {
					sendError(res, 400, error.message, null);
				} else {
					sendError(
						res,
						400,
						"Failed to send verification email",
						null,
					);
				}
			}

			sendRes(res, 201, "Verification email sent successfully", null);
		} catch (error) {
			if (error instanceof Error) {
				sendError(res, 400, error.message, null);
			} else {
				sendError(res, 400, "Failed to send verification email", null);
			}
		}
	} catch (error) {
		sendError(res, 500, "Internal server error", null);
	}
};

/**
 * @controller verifyOtpController
 * @description Verify the OTP sent to the user's email for email verification
 * @body { email: string, otp: string }
 * @returns { message: string }
 */
export const verifyOtpController = async (req: Request, res: Response): Promise<void> => {
	try {
		const { email, otp } = req.body as { email: string; otp: string };
		const isVerified = await verifyOtp(res, email, otp);
		if (isVerified) {
			const user = await AuthModel.findOne({ email });
			if (!user) {
				sendError(res, 400, "User not found", null);
				return;
			}
			user.emailVerified = true;
			await user.save();
			sendRes(res, 200, "OTP verified successfully", null);
		}
	} catch (error) {
		sendError(res, 500, "Internal server error", null);
	}
};

/**
 * @controller loginUserController
 * @description Authenticate user and provide JWT token for session management
 * @body { email: string, password: string }
 * @returns { message: string, token: string }
 */
export const loginUserController = async (
	req: Request,
	res: Response,
): Promise<void> => {
	const extendedReq = req as ExtendedRequest;
	try {
		const { email, password } = req.body as {
			email: string;
			password: string;
		};
		const user = await AuthModel.findOne({ email }).select("+password");
		if (!user) {
			sendError(res, 400, "Invalid email or password", null);
			return;
		}
		if (user.isBanned) {
			sendError(
				res,
				403,
				"Your account has been banned. Please contact support.",
				null,
			);
			return;
		}
		if (!user.emailVerified) {
			sendError(res, 400, "Email not verified", null);
			return;
		}
		const isMatch = await user.comparePassword(password);
		if (!isMatch) {
			sendError(res, 400, "Invalid email or password", null);
			sendMail(
				authEmail,
				user.email,
				"Failed Login Attempt Alert",
				LOGIN_ALERT_EMAIL_TEMPLATE(
					new Date().toLocaleString(),
					req.ip ?? "",
					req.headers["user-agent"] ?? "",
					extendedReq.location ?? "Unknown Location",
					"Failed login attempt detected for your account. If this was not you, please secure your account immediately.",
				)
			);
			return;
		}
		sendMail(
			authEmail,
			user.email,
			"Successful Login Alert",
			LOGIN_ALERT_EMAIL_TEMPLATE(
				new Date().toLocaleString(),
				req.ip ?? "",
				req.headers["user-agent"] ?? "",
				extendedReq.location ?? "Unknown Location",
				"Your account was just accessed successfully. If this was not you, please secure your account immediately.",
			)
		);
		const token = generateToken({
			userId: user._id,
			role: user.role,
		});
		setCookie(res, token);
		sendRes(res, 200, "Login successful", {
			data: config.nodeEnv === "development" ? user : null,
		});
	} catch (error) {
		sendError(res, 500, "Internal server error", error);
	}
};

/**
 * @controller changePasswordController
 * @description Allow authenticated user to change their password
 * @body { oldPassword: string, newPassword: string }
 * @returns { message: string }
 */
export const changePasswordController = async (req: Request, res: Response): Promise<void> => {
	try {
		const { userId } = (req as Request & { user?: DecodedToken }).user as DecodedToken;
		const { oldPassword, newPassword } = req.body as { oldPassword: string; newPassword: string };
		
		const user = await AuthModel.findById(userId).select("+password");
		if (!user) {
			sendError(res, 404, "User not found", null);
			return;
		}
		const isMatch = await user.comparePassword(oldPassword);
		if (!isMatch) {
			sendError(res, 400, "Invalid old password", null);
			return;
		}
		user.password = newPassword;
		await user.save();
		sendRes(res, 200, "Password changed successfully", null);
	} catch (error) {
		sendError(res, 500, "Internal server error", error);
	}
}

/**
 * @controller getMeController
 * @description Return the currently authenticated user's profile
 * @returns { message: string, data: User }
 */
export const getMeController = async (req: Request, res: Response): Promise<void> => {
	try {
		const { userId } = (req as Request & { user?: DecodedToken }).user as DecodedToken;
		const user = await AuthModel.findById(userId).select("-password");
		if (!user) {
			sendError(res, 404, "User not found", null);
			return;
		}
		sendRes(res, 200, "User fetched", user);
	} catch (error) {
		sendError(res, 500, "Internal server error", error);
	}
};

/**
 * @controller logoutUserController
 * @description Logout the authenticated user by clearing the JWT cookie
 * @returns { message: string }
 */
export const logoutUserController = (_req: Request, res: Response): void => {
	try {
		clearCookie(res);
		sendRes(res, 200, "Logout successful", null);
	} catch (error) {
		sendError(res, 500, "Internal server error", null);
	}
};
