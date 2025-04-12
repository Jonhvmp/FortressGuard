import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import environment from "./config/environment.js";
import logger from "./utils/logger.js";
import routes from "./api/routes/index.js";
import rateLimiterMiddleware from './utils/rateLimiter.js';

const app = express();

// midd
app.use(helmet()); // seg c/ headers http
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// midd de logging das req
app.use(morgan(environment.isProd ? "combined" : "dev", {
  stream: {
    write: (message) => logger.info(message.trim()),
  },
}));

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    environment: environment.nodeEnv,
  })
});

// Adicione antes das rotas
app.use(rateLimiterMiddleware);

// rotas da API
app.use(`/api/${environment.apiVersion}`, routes);

// NotFound
app.use((req, res) => {
  res.status(404).json({
    status: 'Not Found',
    message: `Route ${req.method} ${req.url} not found`,
  });
});

// midd err
app.use((err, req, res, next) => {
  logger.error(`${err.name}: ${err.message}`);

  res.status(err.status || 500).json({
    error: err.name || 'InternalServerError',
    message: environment.isProd ? 'An unexpected error occurred' : err.message,
    ...(environment.isProd ? {} : { stack: err.stack }),
  });
});

export default app;
