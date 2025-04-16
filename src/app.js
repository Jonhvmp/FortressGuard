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

// Configurar CORS adequadamente para produção
app.use(cors({
  origin: environment.isProd ? environment.corsOrigin : '*',
  methods: environment.corsMethods || 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: environment.corsAllowedHeaders || 'Content-Type,Authorization',
  credentials: environment.corsCredentials || true,
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

// Configuração do swagger modificada para usar CDN confiável
if (fs.existsSync(swaggerPath)) {
  const swaggerDocument = YAML.load(swaggerPath);
  const swaggerUiOptions = {
    swaggerOptions: {
      url: `/docs/swagger.json`,
    },
    customCss: '.swagger-ui .topbar { display: none }',
    explorer: true
  };

  // Servir o arquivo swagger.json diretamente
  app.get('/docs/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(swaggerDocument));
  });

  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerUiOptions));
  // eslint-disable-next-line max-len
  app.use(`/api/${environment.apiVersion}/docs`, swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerUiOptions));
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

// midd err - CORRIGIDO
app.use((err, req, res, next) => {
  logger.error(`${err.name}: ${err.message}`, err);

  res.status(err.status || 500).json({
    error: err.name || "InternalServerError",
    message: environment.isProd ? "An unexpected error occurred" : err.message,
    ...(environment.isProd ? {} : { stack: err.stack }),
  });
  next();
});

export default app;
