import { jest } from '@jest/globals';
import { RateLimiterMemory } from 'rate-limiter-flexible';

// Mock do environment antes da importação do rateLimiter
jest.mock('../../../src/config/environment.js', () => ({
  default: {
    rateLimit: {
      windowMs: 900000,
      max: 100
    }
  }
}), { virtual: true });

// Mock do logger
jest.mock('../../../src/utils/logger.js', () => ({
  default: {
    warn: jest.fn(),
    info: jest.fn(),
    error: jest.fn()
  }
}), { virtual: true });

// Mock das constantes HTTP
jest.mock('../../../src/config/constants.js', () => ({
  HTTP_STATUS: {
    TOO_MANY_REQUESTS: 429
  }
}), { virtual: true });

// Agora importamos o módulo que estamos testando
import { rateLimiter, rateLimiterMiddleware } from '../../../src/utils/rateLimiter.js';

// Mock para os objetos req e res do Express
const mockRequest = (ip = '127.0.0.1') => ({
  ip,
  headers: {},
  connection: { remoteAddress: ip }
});

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.setHeader = jest.fn();
  return res;
};

describe('Rate Limiter', () => {
  beforeEach(() => {
    // Limpar estado do rate limiter entre testes se necessário
    jest.clearAllMocks();
  });

  test('permite requisições dentro do limite', async () => {
    const req = mockRequest();
    const res = mockResponse();
    const next = jest.fn();

    await rateLimiterMiddleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.setHeader).toHaveBeenCalledTimes(3); // Verifica que os headers de rate limit foram definidos
  });

  // Corrija o teste para capturar a exceção corretamente
  test('bloqueia requisições excessivas', async () => {
    const req = mockRequest('127.0.0.1');
    const res = mockResponse();
    const next = jest.fn();

    // Crie um novo limiter especificamente para o teste
    const testLimiter = new RateLimiterMemory({
      points: 1,
      duration: 1,
    });

    // Mock da função consume para simular limite excedido
    jest.spyOn(rateLimiter, 'consume').mockImplementationOnce(() => {
      return Promise.reject({
        remainingPoints: 0,
        msBeforeNext: 60000
      });
    });

    // Tente fazer uma requisição
    await rateLimiterMiddleware(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(429);
    expect(res.json).toHaveBeenCalled();
  });
});
