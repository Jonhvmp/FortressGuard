import { jest } from '@jest/globals';
import { encrypt, decrypt } from '../../../src/api/services/encryptionService.js';

// Mock do logger
jest.mock('../../../src/utils/logger.js', () => ({
  default: {
    info: jest.fn(),
    error: jest.fn(),
  }
}));

// Mock para o environment do Node
jest.mock('process', () => ({
  env: {
    NODE_ENV: 'development' // Mudado para 'development' para expor errorDetails
  }
}));

// Mock das funções de criptografia
const TRIGGER_ERROR_TEXT = 'trigger-error';

jest.mock('../../../src/utils/cryptoHelpers.js', () => ({
  encryptText: jest.fn((text) => {
    if (text === TRIGGER_ERROR_TEXT) {
      throw new Error('Erro simulado de encriptação');
    }
    return 'iv-mock:texto-criptografado-mock';
  }),

  decryptText: jest.fn((encryptedText) => {
    if (encryptedText === 'trigger-error:mock') {
      throw new Error('Erro simulado de decriptação');
    }
    if (encryptedText === 'iv-mock:texto-criptografado-mock') {
      return 'texto descriptografado';
    }
    throw new Error('Formato inválido');
  })
}));

describe('Encryption Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Resetar os mocks antes de cada teste
    const cryptoHelpers = jest.requireMock('../../../src/utils/cryptoHelpers.js');
    cryptoHelpers.encryptText.mockClear();
    cryptoHelpers.decryptText.mockClear();
  });

  describe('encrypt', () => {
    test('criptografa texto corretamente', () => {
      const result = encrypt('texto para criptografar');

      expect(result).toHaveProperty('success', true);
      expect(result).toHaveProperty('encryptedText');
      expect(result).toHaveProperty('originalLength', 'texto para criptografar'.length);
      expect(result).toHaveProperty('encryptedLength', expect.any(Number));
      expect(result).toHaveProperty('timestamp');
      expect(result).toHaveProperty('message', 'Criptografia realizada com sucesso');
    });

    test('retorna erro quando o texto não é fornecido', () => {
      const result = encrypt('');

      expect(result).toHaveProperty('success', false);
      expect(result).toHaveProperty('message', 'Texto não fornecido para criptografia');
      expect(result).toHaveProperty('errorType', 'validation_error');
    });

    test('retorna erro quando o texto não é uma string', () => {
      const result = encrypt(123);

      expect(result).toHaveProperty('success', false);
      expect(result).toHaveProperty('message', 'Texto deve ser uma string');
      expect(result).toHaveProperty('errorType', 'validation_error');
    });

    test('retorna erro quando o texto excede o tamanho máximo', () => {
      const longText = 'a'.repeat(1001);
      const result = encrypt(longText);

      expect(result).toHaveProperty('success', false);
      expect(result).toHaveProperty('message', 'Texto deve ter no máximo 1000 caracteres');
      expect(result).toHaveProperty('errorType', 'validation_error');
    });

    test('retorna erro quando o texto contém apenas caracteres especiais', () => {
      const result = encrypt('!@#$%^&*()');

      expect(result).toHaveProperty('success', false);
      expect(result).toHaveProperty('message', 'Texto não pode conter apenas caracteres especiais');
      expect(result).toHaveProperty('errorType', 'validation_error');
    });
    test('lida com exceção durante a criptografia', () => {
      const result = encrypt(TRIGGER_ERROR_TEXT);

      expect(result).toHaveProperty('success', false);
      expect(result).toHaveProperty('message', 'Erro ao encriptar texto');
      expect(result).toHaveProperty('errorType', 'encryption_error');
      expect(result).toHaveProperty('errorDetails', 'Erro simulado de encriptação');
    });
  });

  describe('decrypt', () => {
    test('descriptografa texto corretamente', () => {
      const result = decrypt('iv-mock:texto-criptografado-mock');

      expect(result).toHaveProperty('success', true);
      expect(result).toHaveProperty('decryptedText', 'texto descriptografado');
      expect(result).toHaveProperty('length', 'texto descriptografado'.length);
      expect(result).toHaveProperty('timestamp');
      expect(result).toHaveProperty('message', 'Descriptografia realizada com sucesso');
    });

    test('retorna erro quando o texto criptografado não é fornecido', () => {
      const result = decrypt('');

      expect(result).toHaveProperty('success', false);
      // eslint-disable-next-line max-len
      expect(result).toHaveProperty('message', 'Texto criptografado não fornecido para descriptografia');
      expect(result).toHaveProperty('errorType', 'validation_error');
    });

    test('retorna erro quando o texto criptografado não é uma string', () => {
      const result = decrypt(123);

      expect(result).toHaveProperty('success', false);
      expect(result).toHaveProperty('message', 'Texto criptografado deve ser uma string');
      expect(result).toHaveProperty('errorType', 'validation_error');
    });

    test('retorna erro quando o formato do texto criptografado é inválido', () => {
      const result = decrypt('texto-sem-formato-correto');

      expect(result).toHaveProperty('success', false);
      expect(result).toHaveProperty('message', 'Formato de texto criptografado inválido');
      expect(result).toHaveProperty('errorType', 'validation_error');
    });

    test('lida com exceção durante a descriptografia', () => {
      const result = decrypt('trigger-error:mock');

      expect(result).toHaveProperty('success', false);
      expect(result).toHaveProperty('message', 'Erro ao descriptografar texto');
      expect(result).toHaveProperty('errorType', 'decryption_error');
      // eslint-disable-next-line max-len
      expect(result).toHaveProperty('errorDetails', process.env.NODE_ENV === 'development' ? 'Erro simulado de decriptação' : undefined);
    });
  });
});
