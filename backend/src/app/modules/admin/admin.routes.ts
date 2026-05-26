import { Router } from "express";
import { GetUserMiddleware } from "../../core/middlewares/user.middleware.js";
import { AdminMiddleware }   from "../../core/middlewares/admin.middleware.js";
import {
	getStats,
	getUsers, updateUser,
	getFeedbackList, deleteFeedback,
	getReportList, updateReport, deleteReport,
} from "./admin.controller.js";

const adminRouter = Router();

// Every admin route requires a valid session + admin role in DB
adminRouter.use(GetUserMiddleware, AdminMiddleware);

// ── Overview ──────────────────────────────────────────────
adminRouter.get("/stats", getStats);

// ── Users ─────────────────────────────────────────────────
adminRouter.get   ("/users",     getUsers);
adminRouter.patch ("/users/:id", updateUser);

// ── Feedback ──────────────────────────────────────────────
adminRouter.get   ("/feedback",     getFeedbackList);
adminRouter.delete("/feedback/:id", deleteFeedback);

// ── Reports ───────────────────────────────────────────────
adminRouter.get   ("/reports",     getReportList);
adminRouter.patch ("/reports/:id", updateReport);
adminRouter.delete("/reports/:id", deleteReport);

export default adminRouter;
