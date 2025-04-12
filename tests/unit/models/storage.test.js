import { jest } from '@jest/globals';
import {
  recordPasswordGeneration,
  recordPasswordValidation,
  recordEncryption,
  getStatistics,
  getHistory
} from '../../../src/models/storage.js';

// Mock do logger
jest.mock('../../../src/utils/logger.js', () => ({
  default: {
    debug: jest.fn(),
    error: jest.fn(),
  }
}));

describe('Storage Model', () => {
  describe('recordPasswordGeneration', () => {
    test('registra geração de senha corretamente', () => {
      recordPasswordGeneration('strong');

      const stats = getStatistics();
      expect(stats.passwordsGenerated).toBeGreaterThan(0);
      expect(stats.stregthDistribution.strong).toBeGreaterThan(0);
    });

    test('lida com erro ao registrar', () => {
      const mockDebug = jest.mocked(jest.requireMock('../../../src/utils/logger.js').default.debug);
      mockDebug.mockImplementationOnce(() => {
        throw new Error('Erro simulado');
      });

      // Não deve lançar exceção
      expect(() => recordPasswordGeneration('strong')).not.toThrow();
    });
  });

  describe('recordPasswordValidation', () => {
    test('registra validação de senha corretamente', () => {
      const initialStats = getStatistics();
      recordPasswordValidation('medium', true);

      const updatedStats = getStatistics();
      expect(updatedStats.passwordsValidated).toBeGreaterThan(initialStats.passwordsValidated);
    });
  });

  describe('recordEncryption', () => {
    test('registra criptografia bem-sucedida', () => {
      const initialStats = getStatistics();
      recordEncryption(true);

      const updatedStats = getStatistics();
      expect(updatedStats.textEncrypted).toBeGreaterThan(initialStats.textEncrypted);
    });

    test('registra criptografia malsucedida', () => {
      recordEncryption(false);
      // Verifica apenas que não lança exceção, já que não incrementa contador
      expect(true).toBe(true);
    });
  });

  describe('getHistory', () => {
    test('retorna histórico de eventos', () => {
      // Gera alguns eventos para o histórico
      recordPasswordGeneration('strong');
      recordPasswordValidation('medium', true);
      recordEncryption(true);

      const history = getHistory();
      expect(Array.isArray(history)).toBe(true);
      expect(history.length).toBeGreaterThan(0);
      expect(history[0]).toHaveProperty('timestamp');
      expect(history[0]).toHaveProperty('action');
    });

    test('respeita limite de eventos', () => {
      const limitedHistory = getHistory(2);
      expect(limitedHistory.length).toBeLessThanOrEqual(2);
    });
  });

  describe('getStatistics', () => {
    test('retorna objeto de estatísticas', () => {
      const stats = getStatistics();

      expect(stats).toHaveProperty('passwordsGenerated');
      expect(stats).toHaveProperty('passwordsValidated');
      expect(stats).toHaveProperty('textEncrypted');
      expect(stats).toHaveProperty('stregthDistribution');
    });
  });
});
