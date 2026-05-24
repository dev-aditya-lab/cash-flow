import sendRes from "../../core/response/sucess.response.js";
import AuthModel from "./auth.schema.js";
import type { Request, RequestHandler, Response } from "express";
import type { RegisterUserRequest } from "./auth.types.js";
import sendError from "../../core/response/error.response.js";
import { generateToken, verifyToken } from "../../shared/utils/jwtHandler.js";
import { clearCookie, setCookie } from "../../shared/utils/setCookies.js";
import sendMail from "../../shared/utils/sendMail.service.js";
import { generateOtp } from "../../shared/utils/genreateOtp.service.js";
import { authEmail } from "../../core/constent/constent.js";
import { OTP_EMAIL_TEMPLATE } from "../../shared/services/mail/emailTemplate/otp.emailTemplate.js";
import { generateEmailVerificationURL } from "../../shared/utils/genreateEmailVerifyURL.js";
import config from "../../config/env.config.js";
import { saveOtp, verifyOtp } from "../../shared/utils/otpHandlers.js";

interface ExtendedRequest extends Request {
	timestamp: string;
	deviceInfo: string;
	location: string;
}

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
						extendedReq.deviceInfo,
						extendedReq.location,
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

export const verifyEmailController = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const { token } = req.query as { token: string };
		const decoded = verifyToken(token);
		console.log(decoded);
		const user = await AuthModel.findOne({ email: decoded.email });
		if (!user) {
			sendError(res, 400, "Invalid token", null);
			return;
		}
		user.emailVerified = true;
		await user.save();
		sendRes(res, 200, "Email verified successfully", decoded);
	} catch (error) {
		sendError(res, 400, "Invalid token", null);
	}
};

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

export const verifyOtpController = async (req: Request, res: Response): Promise<void> => {
	try {
		const { email, otp } = req.body as { email: string; otp: string };
		const isVerified = await verifyOtp(res, email, otp);
		if (isVerified) {
			sendRes(res, 200, "OTP verified successfully", null);
		}
	} catch (error) {
		sendError(res, 500, "Internal server error", null);
	}
};

export const loginUserController = async (
	req: Request,
	res: Response,
): Promise<void> => {
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
			return;
		}
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

export const resetPasswordController = async (req: Request, res: Response): Promise<void> => {}

export const logoutUserController = (_req: Request, res: Response): void => {
	try {
		clearCookie(res);
		sendRes(res, 200, "Logout successful", null);
	} catch (error) {
		sendError(res, 500, "Internal server error", null);
	}
};
