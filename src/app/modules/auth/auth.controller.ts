import sendRes from "../../core/response/sucess.response.js";
import AuthModel from "./auth.schema.js";
import type { Request, Response } from "express";
import type { RegisterUserRequest } from "./auth.types.js";
import sendError from "../../core/response/error.response.js";
import { generateToken } from "../../shared/utils/jwtHandler.js";
import { setCookie } from "../../shared/utils/setCookies.js";

export const registerUserController = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
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
			const { password: _, ...userWithoutPassword } = createdUser.toObject();
			const token = generateToken({
				userId: createdUser._id,
				role: createdUser.role,
			});
			setCookie(res, token);
			sendRes(res, 201, "User registered successfully", userWithoutPassword);
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
