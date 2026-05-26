import type { Request, Response } from "express";
import sendError from "../../core/response/error.response.js";
import ReportModel from "./report.model.js";
import sendRes from "../../core/response/sucess.response.js";

export const getReport = async (req: Request, res: Response) => {
	try {
		const { message, type } = req.body;
		const { userId } = (req as Request & { user?: unknown }).user as {
			userId: string;
		};
		if (!userId) {
			sendError(res, 401, "Unauthorized", null);
			return;
		}

		const report = await ReportModel.create({
			user: userId,
			message,
			type,
		});

		sendRes(res, 201, "Report submitted successfully", report);
	} catch (error) {
		sendError(res, 500, "Internal server error", null);
	}
};
