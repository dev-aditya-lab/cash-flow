import type { Request, Response } from "express";
import sendError from "../../core/response/error.response.js";
import sendRes   from "../../core/response/sucess.response.js";
import AuthModel     from "../auth/auth.schema.js";
import FeedbackModel from "../feedback/feedback.model.js";
import ReportModel   from "../report/report.model.js";

// ── Overview ──────────────────────────────────────────────

/**
 * GET /api/admin/stats
 * Aggregate counts for dashboard overview cards.
 */
export const getStats = async (_req: Request, res: Response) => {
	try {
		const [users, feedback, reports, openReports] = await Promise.all([
			AuthModel.countDocuments(),
			FeedbackModel.countDocuments(),
			ReportModel.countDocuments(),
			ReportModel.countDocuments({ status: "open" }),
		]);
		sendRes(res, 200, "Stats fetched", { users, feedback, reports, openReports });
	} catch {
		sendError(res, 500, "Internal server error", null);
	}
};

// ── Users ─────────────────────────────────────────────────

/**
 * GET /api/admin/users
 * All registered users (password excluded).
 */
export const getUsers = async (_req: Request, res: Response) => {
	try {
		const users = await AuthModel
			.find()
			.select("-password")
			.sort({ createdAt: -1 })
			.lean();
		sendRes(res, 200, "Users fetched", users);
	} catch {
		sendError(res, 500, "Internal server error", null);
	}
};

/**
 * PATCH /api/admin/users/:id
 * Update a user's role or banned status.
 * Body: { role?: "user" | "admin"; isBanned?: boolean }
 */
export const updateUser = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const { role, isBanned } = req.body as {
			role?: "user" | "admin";
			isBanned?: boolean;
		};

		const allowedFields: Record<string, unknown> = {};
		if (role     !== undefined) allowedFields.role     = role;
		if (isBanned !== undefined) allowedFields.isBanned = isBanned;

		const updated = await AuthModel
			.findByIdAndUpdate(id, allowedFields, { new: true, runValidators: true })
			.select("-password")
			.lean();

		if (!updated) {
			sendError(res, 404, "User not found", null);
			return;
		}
		sendRes(res, 200, "User updated successfully", updated);
	} catch {
		sendError(res, 500, "Internal server error", null);
	}
};

// ── Feedback ──────────────────────────────────────────────

/**
 * GET /api/admin/feedback
 * All feedback with submitting user's name + email.
 */
export const getFeedbackList = async (_req: Request, res: Response) => {
	try {
		const feedback = await FeedbackModel
			.find()
			.populate("user", "name email")
			.sort({ createdAt: -1 })
			.lean();
		sendRes(res, 200, "Feedback fetched", feedback);
	} catch {
		sendError(res, 500, "Internal server error", null);
	}
};

/**
 * DELETE /api/admin/feedback/:id
 * Permanently delete a feedback entry.
 */
export const deleteFeedback = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const deleted = await FeedbackModel.findByIdAndDelete(id).lean();
		if (!deleted) {
			sendError(res, 404, "Feedback not found", null);
			return;
		}
		sendRes(res, 200, "Feedback deleted", null);
	} catch {
		sendError(res, 500, "Internal server error", null);
	}
};

// ── Reports ───────────────────────────────────────────────

/**
 * GET /api/admin/reports
 * All reports with submitting user's name + email.
 */
export const getReportList = async (_req: Request, res: Response) => {
	try {
		const reports = await ReportModel
			.find()
			.populate("user", "name email")
			.sort({ createdAt: -1 })
			.lean();
		sendRes(res, 200, "Reports fetched", reports);
	} catch {
		sendError(res, 500, "Internal server error", null);
	}
};

/**
 * PATCH /api/admin/reports/:id
 * Update a report's status.
 * Body: { status: "open" | "resolved" }
 */
export const updateReport = async (req: Request, res: Response) => {
	try {
		const { id }     = req.params;
		const { status } = req.body as { status: "open" | "resolved" };

		const updated = await ReportModel
			.findByIdAndUpdate(id, { status }, { new: true, runValidators: true })
			.populate("user", "name email")
			.lean();

		if (!updated) {
			sendError(res, 404, "Report not found", null);
			return;
		}
		sendRes(res, 200, "Report updated", updated);
	} catch {
		sendError(res, 500, "Internal server error", null);
	}
};

/**
 * DELETE /api/admin/reports/:id
 * Permanently delete a report.
 */
export const deleteReport = async (req: Request, res: Response) => {
	try {
		const { id }  = req.params;
		const deleted = await ReportModel.findByIdAndDelete(id).lean();
		if (!deleted) {
			sendError(res, 404, "Report not found", null);
			return;
		}
		sendRes(res, 200, "Report deleted", null);
	} catch {
		sendError(res, 500, "Internal server error", null);
	}
};
