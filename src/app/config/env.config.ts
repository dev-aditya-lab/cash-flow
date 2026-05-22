import dotenv from "dotenv";
dotenv.config();

const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  dbUrl: process.env.DB_URL || "",
  jwtSecret: process.env.JWT_SECRET || "",
  jwtExpiry: process.env.JWT_EXPIRY || "7d",
  corsOrigin: process.env.CORS_ORIGIN || "*",
  DB_NAME: process.env.DB_NAME || "cashflow"
};

// Validate required variables
const required = ["dbUrl", "jwtSecret", "DB_NAME"] as const;

for (const key of required) {
  if (!config[key]) {
    throw new Error(`Missing required env variable: ${key}`);
  }
}

export default config;