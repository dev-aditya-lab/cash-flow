import express from "express";
import morgan from "morgan";
import type { Request, Response } from "express";
import corsConfig from "./config/cors.config.js";
import sendRes from "./core/response/sucess.response.js";
const app = express();

app.use(corsConfig);
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (_req: Request, res: Response): void => {
	sendRes(res, 500, "Welcome to the Express TypeScript API", {
		version: "1.0.0",
		app: "CashFlow"
	});
});

export default app;
