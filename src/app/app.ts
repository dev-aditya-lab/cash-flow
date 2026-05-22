import express from 'express';
import corsConfig from './config/cors.config.js';
const app = express();

app.use(corsConfig);


export default app;