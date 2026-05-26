import express from "express";
import morgan from "morgan";
import corsConfig from "./config/cors.config.js";
import cookieParser from "cookie-parser";


import authRouter from "./modules/auth/auth.routes.js";
import expanceRouter from "./modules/expances/expance.route.js";
import incomeRouter from "./modules/income/income.routes.js";
import balanceRouter from "./modules/balance/balance.routes.js";
import feedbackRouter from "./modules/feedback/feedback.route.js";
import reportRouter from "./modules/report/report.route.js";

const app = express();

app.use(corsConfig);
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());



// Routes

/**
 * @route /api/auth
 * @description Authentication routes (register, login, logout)
 * @route /api/expance
 * @description Expance management routes (add, get, delete, update expances)
 */
app.use("/api/auth",authRouter);

/**
 * @route /api/expance
 * @description Expance management routes (add, get, delete, update expances)
 */
app.use("/api/expance",expanceRouter);

/**
 * @route /api/income
 * @description Income management routes (add, get, delete, update incomes)
 */
app.use("/api/income",incomeRouter);

/**
 * @route /api/balance
 * @description Balance management routes (get balance)
 */
app.use("/api/balance",balanceRouter);

/**
 * @route /api/feedback
 * @description Feedback management routes (submit feedback)
 */
app.use("/api/feedback",feedbackRouter);

/**
 * @route /api/report
 * @description Report management routes (submit report)
 */
app.use("/api/report",reportRouter);

/**
 * @route GET /
 * @description Welcome message for the Cash Flow API
 */
app.get("/", (_req, res) => {
	res.send("Welcome to Cash Flow API");
});

export default app;
