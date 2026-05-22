import express from 'express';
import corsConfig from './config/cors.config.js';
import logger from './core/middlewares/logger.middleware.js';
const app = express();

app.use(corsConfig);
app.use(logger);


export default app;