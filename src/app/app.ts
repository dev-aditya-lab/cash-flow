import express from "express";
import morgan from "morgan";
import corsConfig from "./config/cors.config.js";
import authRouter from "./modules/auth/auth.routes.js";
import expanceRouter from "./modules/expances/expance.route.js";
import cookieParser from "cookie-parser";
const app = express();

app.use(corsConfig);
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/auth",authRouter);
app.use("/api/expance",expanceRouter);

app.get("/", (_req, res) => {
	res.send("Welcome to Cash Flow API");
});

export default app;
