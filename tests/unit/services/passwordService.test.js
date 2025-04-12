import { jest } from '@jest/globals';
import { generatePassword, validatePassword } from '../../../src/api/services/passwordService.js';

// Agora podemos usar jest.mock corretamente
jest.mock('../../../src/utils/logger.js', () => ({
  default: {
    info: jest.fn(),
    error: jest.fn(),
  }
}));

// Correção do mock para passwordStrength
jest.mock('../../../src/utils/passwordStrength.js', () => ({
  evaluatePasswordStrength: jest.fn().mockImplementation((password) => {
    if (!password || password === 'weak') {
      return {
        strength: 'weak',
        score: 2,
        details: {},
        feedback: ''
      };
    } else {
      return {
        strength: 'strong',
        score: 6,
        details: {},
        feedback: ''
      };
    }
  }),
  meetsMinimumRequirements: jest.fn().mockImplementation((password) => {
    return password !== 'weak' && password !== '';
  })
}));

// Mock para cryptoHelpers
jest.mock('../../../src/utils/cryptoHelpers.js', () => ({
  generateRandomString: jest.fn().mockReturnValue('MockedPassword123!'),
  generateHash: jest.fn().mockReturnValue('hashedpassword123')
}));

describe('Password Service', () => {
  describe('generatePassword', () => {
    test('gera senha com o comprimento especificado', () => {
      const length = 16;
      const result = generatePassword(length, true);

      expect(result).toHaveProperty('password');
      expect(result.password.length).toBe(length);
      expect(result).toHaveProperty('strength');
      expect(result).toHaveProperty('score');
    });

    test('gera senha sem caracteres especiais quando especificado', () => {
      const result = generatePassword(12, false);

      expect(result).toHaveProperty('password');
      expect(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(result.password)).toBe(false);
    });
  });

  describe('validatePassword', () => {
    test('valida senhas fortes corretamente', () => {
      const result = validatePassword('StrongP@ssw0rd!');

      expect(result.valid).toBe(true);
      expect(result.strength).toBe('strong');
      expect(result.score).toBeGreaterThanOrEqual(5);
    });

    test('identifica senhas fracas corretamente', () => {
      const result = validatePassword('weak');

      expect(result.valid).toBe(false);
      expect(result.strength).toBe('weak');
      expect(result.score).toBeLessThan(3);
    });
  });
});
