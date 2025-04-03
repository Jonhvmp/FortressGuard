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
