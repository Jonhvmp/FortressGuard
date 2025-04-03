import crypto from 'crypto';
import { ENCRYPTION_ALGORITHMS } from '../config/constants';
import environment from '../config/environment.js';
import logger from './logger.js';

// chave de cript do ambiente ou usamos uma padrão apenas p/ desen
const ENCRYPTION_KEY = environment.ENCRYPTION_KEY || '32_defaultEncryptionKey1234567890';

/**
 * Gera um hash para uma string usando SHA-256.
 * @param {string} text - O texto p gerar a hash.
 * @return {string} - O hash gerado.
 */

export const generateHash = (text) => {
  try {
    return crypto
      .createHash(ENCRYPTION_ALGORITHMS.SHA256)
      .update(text)
      .digest('hex');
  } catch (error) {
    logger.error(`Erro ao gerar hash: ${error.message}`);
    throw new Error('Erro ao gerar hash');
  }
};

/**
 * Criptografa um texto usando AES-256-CBC.
 * @param {string} text - O texto p/ criptografar
 * @return {string} - O texto criptografado em form hex
 */

export const encryptText = (text) => {
  try {
    const iv = crypto.randomBytes(16); // vetor inicial
    const cipher = crypto.createCipheriv(
      ENCRYPTION_ALGORITHMS.AES,
      Buffer.from(ENCRYPTION_KEY),
      iv
    );

    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    // concatena o vetor inicial com o texto criptografado
    return iv.toString('hex') + ':' + encrypted;
  } catch (error) {
    logger.error(`Erro ao criptografar texto: ${error.message}`);
    throw new Error('Erro ao criptografar texto');
  }
};
