import mongoose from "mongoose";
import config from "./env.config.js";

const mongoOptions: mongoose.ConnectOptions = {
  maxPoolSize: 10,
  minPoolSize: 2,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 10000,
  serverSelectionTimeoutMS: 5000,
  heartbeatFrequencyMS: 10000,
  retryWrites: true,
  retryReads: true,
  autoIndex: config.nodeEnv === "development",
  dbName: config.DB_NAME
};

async function connectDB(retries = 5, delay = 5000): Promise<void> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await mongoose.connect(config.dbUrl, mongoOptions);
      console.log(`✅ MongoDB connected | Pool: ${mongoOptions.maxPoolSize}`);
      registerEvents();
      return;
    } catch (error) {
      console.error(`❌ Attempt ${attempt}/${retries} failed:`, error);
      if (attempt === retries) {
        console.error("All connection attempts exhausted. Exiting.");
        process.exit(1);
      }
      console.log(`Retrying in ${delay / 1000}s...`);
      await new Promise((res) => setTimeout(res, delay));
    }
  }
}

function registerEvents() {
  const db = mongoose.connection;
  db.on("error", (err) => console.error("❌ MongoDB error:", err));
  db.on("disconnected", () => console.warn("⚠️ MongoDB disconnected"));
  db.on("reconnected", () => console.log("🔄 MongoDB reconnected"));
}

async function disconnectDB(): Promise<void> {
  await mongoose.connection.close();
  console.log("MongoDB connection closed gracefully");
}

async function healthCheck(): Promise<boolean> {
  try {
    await mongoose.connection.db?.admin().ping();
    return true;
  } catch {
    return false;
  }
}

export { connectDB, disconnectDB, healthCheck };