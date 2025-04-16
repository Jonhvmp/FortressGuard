import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import environment from "./config/environment.js";
import logger from "./utils/logger.js";
import routes from "./api/routes/index.js";
import rateLimiterMiddleware from "./utils/rateLimiter.js";
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();

// midd
app.use(helmet()); // seg c/ headers http
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
  },
}));

// Configurar CORS de forma mais permissiva para desenvolvimento
app.use(cors({
  origin: '*', // Permitir qualquer origem em desenvolvimento
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// midd de logging das req
app.use(
  morgan(environment.isProd ? "combined" : "dev", {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  }),
);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const swaggerPath = path.join(__dirname, '../docs/api/swagger.yaml');

if (fs.existsSync(swaggerPath)) {
  const swaggerDocument = YAML.load(swaggerPath);
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  app.use(`/api/${environment.apiVersion}/docs`, swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} else {
  // eslint-disable-next-line max-len
  logger.warn('Arquivo de documentação Swagger não encontrado. Execute npm run docs:generate primeiro.');
}

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "UP",
    timestamp: new Date().toISOString(),
    environment: environment.nodeEnv,
  });
});

// Adicione antes das rotas
app.use(rateLimiterMiddleware);

// rotas da API
app.use(`/api/${environment.apiVersion}`, routes);

// NotFound
app.use((req, res) => {
  res.status(404).json({
    status: "Not Found",
    message: `Route ${req.method} ${req.url} not found`,
  });
});

// midd err
app.use((err, req, res) => {
  logger.error(`${err.name}: ${err.message}`);

  res.status(err.status || 500).json({
    error: err.name || "InternalServerError",
    message: environment.isProd ? "An unexpected error occurred" : err.message,
    ...(environment.isProd ? {} : { stack: err.stack }),
  });
});

export default app;
