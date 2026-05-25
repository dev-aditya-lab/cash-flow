import type { Response } from "express";

interface ErrorPayload {
	success: false;
	status: number;
	message: string;
	errors: any;
}

function sendError(
	res: Response,
	status: number,
	message: string,
	errors: any = null,
): Response {
	const payload: ErrorPayload = {
		success: false,
		status,
		message,
		errors,
	};
	return res.status(status).json(payload);
}

export default sendError;
