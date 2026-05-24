import dotenv from "dotenv";
dotenv.config();

const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  dbUrl: process.env.DB_URL || "",
  jwtSecret: process.env.JWT_SECRET || "",
  jwtExpiry: process.env.JWT_EXPIRY || "7d",
  corsOrigin: process.env.CORS_ORIGIN || "*",
  DB_NAME: process.env.DB_NAME || "cashflow",
  resendApiKey: process.env.RESEND_API_KEY || "",
  defaultEmail: process.env.DEFAULT_EMAIL || "cashflow@devaditya.dev",
  frontendUrl: process.env.FRONTEND_URL || "https://cashflow.devaditya.dev",
  redisUrl: process.env.REDIS_URL || "",
};

// Validate required variables
const required = ["dbUrl", "jwtSecret", "DB_NAME", "resendApiKey", "defaultEmail", "redisUrl"] as const;

for (const key of required) {
  if (!config[key]) {
    throw new Error(`Missing required env variable: ${key}`);
  }
}

export default config;