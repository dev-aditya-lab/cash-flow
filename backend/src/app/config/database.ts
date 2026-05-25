import mongoose from "mongoose";
import config from "./env.config.js";

// Cache the in-flight connection promise across serverless invocations
// that share the same Node.js process (warm instances on Vercel).
declare global {
  // eslint-disable-next-line no-var
  var _mongoConn: Promise<void> | undefined;
}

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
  dbName: config.DB_NAME,
};

async function connectDB(retries = 5, delay = 5000): Promise<void> {
  // readyState 1 = connected — reuse the existing connection
  if (mongoose.connection.readyState === 1) {
    console.log("♻️  MongoDB reusing cached connection");
    return;
  }

  // A connection attempt is already in-flight (parallel cold starts) — join it
  if (global._mongoConn) {
    return global._mongoConn;
  }

  // No connection yet — start one and cache the promise so parallel
  // invocations wait on the same attempt instead of opening duplicates.
  global._mongoConn = (async () => {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        await mongoose.connect(config.dbUrl, mongoOptions);
        registerEvents();
        console.log(`✅ MongoDB connected | Pool: ${mongoOptions.maxPoolSize}`);
        return;
      } catch (error) {
        console.error(`❌ Attempt ${attempt}/${retries} failed:`, error);
        if (attempt === retries) {
          global._mongoConn = undefined; // reset so the next request can retry
          console.error("All connection attempts exhausted.");
          throw error;
        }
        console.log(`Retrying in ${delay / 1000}s...`);
        await new Promise((res) => setTimeout(res, delay));
      }
    }
  })();

  return global._mongoConn;
}

function registerEvents() {
  const db = mongoose.connection;
  db.on("error", (err) => console.error("❌ MongoDB error:", err));
  db.on("disconnected", () => console.warn("⚠️  MongoDB disconnected"));
  db.on("reconnected", () => console.log("🔄 MongoDB reconnected"));
}

async function disconnectDB(): Promise<void> {
  await mongoose.connection.close();
  global._mongoConn = undefined;
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
