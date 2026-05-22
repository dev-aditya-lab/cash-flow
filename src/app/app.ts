import express from "express";
import type { Request, Response } from "express";
import corsConfig from "./config/cors.config.js";
import logger from "./core/middlewares/logger.middleware.js";
import sendRes from "./core/response/sucess.response.js";
const app = express();

app.use(corsConfig);
app.use(logger);

app.get("/", (_req: Request, res: Response): void => {
	sendRes(res, 200, "Welcome to the Express TypeScript API", {
		version: "1.0.0",
		app: "CashFlow"
	});
});

export default app;
