import type { Response } from "express";
interface SuccessPayload {
	success: true;
	status: number;
	message: string;
	data: any;
}

function sendRes(
	res: Response,
	statusCode: number,
	message: string,
	data: any,
): Response {
	const payload: SuccessPayload = {
		success: true,
		status: statusCode,
		message,
		data,
	};
	return res.status(statusCode).json(payload);
}
export default sendRes;
