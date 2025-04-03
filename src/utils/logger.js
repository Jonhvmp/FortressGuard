import winston from 'winston';
import environment from '../config/environment.js';

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'blue',
};

// add cores ao winston
winston.addColors(colors);

// formato dos logs
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.colorize({ all: true }),
  winston.format.printf((info) => `${info.timestamp} [${info.level}]: ${info.message}`),
);

// config de transporte para os logs
const transports = [
  // Console para todos os logs
  new winston.transports.Console(),

  // logs de erro
  new winston.transports.File({
    filename: 'logs/error.log',
    level: 'error',
  }),

  // todos os logs
  new winston.transports.File({ filename: 'logs/all.log' }),
];

// cria o logger
const logger = winston.createLogger({
  level: environment.isTest ? 'error' : environment.logLevel,
  levels,
  format,
  transports,
});

export default logger;
