import app from "./app.js";
import environment from "./config/environment.js";
import logger from "./utils/logger.js";

const PORT = environment.port;

const server = app.listen(PORT, () => {
  logger.info(`FortessGuard API is running on port ${PORT} in ${environment.nodeEnv} mode`);

  logger.info(`Server ready at: http://localhost:${PORT}`);

  logger.info(`Health check available at: http://localhost:${PORT}/health`);
});

process.on('uncaughtException', (error) => {
  logger.error(`Uncaught Exception: ${error}`);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// tratamento de sinais de término
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

function gracefulShutdown() {
  logger.info('Received kill signal, shutting down gracefully...');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });

  setTimeout(() => {
    logger.error('Forcing shutdown...');
    process.exit(1);
  }, 10000); // 10s para encerrar o servidor
}

export default server;
