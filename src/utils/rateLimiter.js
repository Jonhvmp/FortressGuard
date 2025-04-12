import { RateLimiterMemory } from "rate-limiter-flexible";
import logger from "./logger.js";
import environment from "../config/environment.js";
import { HTTP_STATUS } from "../config/constants.js";

/**
 * Configuração do rate limiter baseada nas configurações do ambiente
 * - windowMs: janela de tempo em milissegundos
 * - max: número máximo de requisições por janela de tempo
 */
const rateLimiter = new RateLimiterMemory({
  points: environment.rateLimit.max, // Número máximo de requisições
  duration: environment.rateLimit.windowMs / 1000, // Converte ms para segundos
  blockDuration: 60 * 5, // Bloqueia por 5 minutos após exceder limite
});

/**
 * Middleware de rate limiting para Express
 * Limita o número de requisições por IP
 * @param {Object} req - Requisição Express
 * @param {Object} res - Resposta Express
 * @param {Function} next - Callback para próximo middleware
 */
export const rateLimiterMiddleware = async (req, res, next) => {
  try {
    await rateLimiter.consume(req.ip);
    res.setHeader("X-RateLimit-Limit", rateLimiter.points);
    res.setHeader("X-RateLimit-Remaining", rateLimiter.points - 1);
    res.setHeader("X-RateLimit-Reset", rateLimiter.msBeforeNext / 1000);
    next();
  } catch (err) {
    if (err.msBeforeNext) {
      res.setHeader("Retry-After", Math.ceil(err.msBeforeNext / 1000));
    }
    res.status(429).json({
      message: "Too many requests, please try again later.",
    });
  }
};

// Para uso em casos específicos ou testes
export { rateLimiter };

// default
export default rateLimiterMiddleware;
