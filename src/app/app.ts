import express from "express";
import morgan from "morgan";
import corsConfig from "./config/cors.config.js";
import authRouter from "./modules/auth/auth.routes.js";
const app = express();

app.use(corsConfig);
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/auth",authRouter);

app.get("/", (_req, res) => {
	res.send("Welcome to Cash Flow API");
});

export default app;
