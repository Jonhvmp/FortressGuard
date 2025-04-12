// eslint-disable-next-line max-len
import { generateHash, encryptText, decryptText, generateRandomString } from '../../../src/utils/cryptoHelpers.js';

describe('Crypto Helpers', () => {
  describe('generateHash', () => {
    test('gera hashes consistentes para a mesma entrada', () => {
      const input = 'texto-para-hash';
      const hash1 = generateHash(input);
      const hash2 = generateHash(input);
      expect(hash1).toBe(hash2);
    });

    test('gera hashes diferentes para entradas diferentes', () => {
      const hash1 = generateHash('texto1');
      const hash2 = generateHash('texto2');
      expect(hash1).not.toBe(hash2);
    });
  });

  describe('encryptText e decryptText', () => {
    test('encripta e descripta texto corretamente', () => {
      const originalText = 'Texto secreto para testar criptografia';
      const encrypted = encryptText(originalText);

      // Verifica que o texto encriptado é diferente do original
      expect(encrypted).not.toBe(originalText);

      // Verifica que contém o formato com IV (iv:encrypted)
      expect(encrypted.includes(':')).toBe(true);

      // Verifica que é possível descriptografar
      const decrypted = decryptText(encrypted);
      expect(decrypted).toBe(originalText);
    });
  });

  describe('generateRandomString', () => {
    test('gera strings do comprimento correto', () => {
      const length = 16;
      const randomString = generateRandomString(length);
      expect(randomString.length).toBe(length);
    });

    test('inclui caracteres especiais quando solicitado', () => {
      const randomString = generateRandomString(20, true);
      // Verifica se contém pelo menos um caractere especial
      expect(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(randomString)).toBe(true);
    });

    test('não inclui caracteres especiais quando não solicitado', () => {
      const randomString = generateRandomString(20, false);
      // Verifica que não contém caracteres especiais
      expect(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(randomString)).toBe(false);
    });
  });
});
