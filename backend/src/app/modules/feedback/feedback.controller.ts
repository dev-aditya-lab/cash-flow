import type { Request, Response } from "express";
import sendError from "../../core/response/error.response.js";
import FeedbackModel from "./feedback.model.js";
import sendRes from "../../core/response/sucess.response.js";

export const getFeedback = async (req: Request, res: Response) => {
	try {
		const { message, rating } = req.body;
		const { userId } = (req as Request & { user?: unknown }).user as {
			userId: string;
		};
		if (!userId) {
			sendError(res, 401, "Unauthorized", null);
			return;
		}

		const feedback = await FeedbackModel.create({
			user: userId,
			message,
			rating,
		});

		sendRes(res, 201, "Feedback submitted successfully", feedback);
	} catch (error) {
		sendError(res, 500, "Internal server error", null);
	}
};
