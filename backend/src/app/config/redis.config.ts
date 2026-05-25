import { createClient } from "redis";
import config from "./env.config.js";

// Cache the client instance across serverless invocations that share
// the same Node.js process (warm instances on Vercel).
declare global {
  // eslint-disable-next-line no-var
  var _redisClient: ReturnType<typeof createClient> | undefined;
}

if (!global._redisClient) {
  global._redisClient = createClient({ url: config.redisUrl });
  global._redisClient.on("error",       (err) => console.error("❌ Redis Client Error:", err));
  global._redisClient.on("connect",     ()    => console.log("✅ Redis connected"));
  global._redisClient.on("reconnecting",()    => console.log("🔄 Redis reconnecting..."));
}

const redisClient = global._redisClient;

/**
 * Connect to Redis only if the client is not already open.
 * Safe to call on every cold start — no-op on warm instances.
 */
async function connectRedis(): Promise<void> {
  if (redisClient.isOpen) {
    console.log("♻️  Redis reusing cached connection");
    return;
  }
  await redisClient.connect();
}

export { connectRedis };
export default redisClient;
