import cors from "cors";
import config from "./env.config.js";

const corsOptions: cors.CorsOptions = {
  origin: config.corsOrigin === "*"
    ? "*"
    : config.corsOrigin.split(","),
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  maxAge: 86400,
};

export default cors(corsOptions);