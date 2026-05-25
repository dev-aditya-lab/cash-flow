import type { Request, Response } from "express";
import sendError from "../../core/response/error.response.js";
import sendRes from "../../core/response/sucess.response.js";
import { Expance } from "./expance.model.js";



export const addExpance = async (req: Request, res: Response) => {
	try {
		const { amount, mode, to, resion, description, date } = req.body;
		const { userId } = (req as Request & { user?: unknown }).user as {
			userId: string;
		};
		if (!userId) {
			sendError(res, 401, "Unauthorized", null);
			return;
		}
		if (!amount || !mode || !to || !resion) {
			sendError(res, 400, "All fields are required", null);
			return;
		}
		const expance = await Expance.create({
			userId,
			amount,
			mode,
			to,
			resion,
			description,
			date: date || new Date(),
		});
		sendRes(res, 201, "Expance added successfully", expance);
	} catch (error) {
		sendError(res, 500, "Failed to add expance", error);
	}
};
