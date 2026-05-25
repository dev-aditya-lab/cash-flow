import app from "./app/app.js";
import config from "./app/config/env.config.js";
import { connectDB, disconnectDB, healthCheck } from "./app/config/database.js";
import redisClient, { connectRedis } from "./app/config/redis.config.js";

async function startServer() {
  await connectDB();
  await connectRedis();

  app.get("/health", async (_req, res) => {
    const dbAlive = await healthCheck();
    res.status(dbAlive ? 200 : 503).json({
      status: dbAlive ? "healthy" : "unhealthy",
      db: dbAlive ? "connected" : "disconnected",
      uptime: process.uptime(),
    });
  });

  app.listen(config.port, () => {
    console.log(`Server is running on http://localhost:${config.port}`);
  });
}

// Graceful shutdown
for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, async () => {
    console.log(`\n${signal} received. Shutting down...`);
    await disconnectDB();
    if (redisClient.isOpen) await redisClient.quit();
    process.exit(0);
  });
}

process.on("unhandledRejection", (err) => {
  console.error("Unhandled rejection:", err);
  process.exit(1);
});

startServer();
