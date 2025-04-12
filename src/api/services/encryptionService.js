import { encryptText, decryptText } from "../../utils/cryptoHelpers.js";
import logger from "../../utils/logger.js";

const MAX_PLAINTEXT_LENGTH = 1000;
const ERROR_TYPES = {
  VALIDATION: 'validation_error',
  ENCRYPTION: 'encryption_error',
  DECRYPTION: 'decryption_error',
};

/**
 * Criptografa um texto fornecido
 * @param {string} text - O texto a ser criptografado
 * @returns {Object} - Resultado da operação de criptografia
 *   @returns {boolean} success - Se a operação foi bem sucedida
 *   @returns {string} [encryptedText] - O texto criptografado (apenas se success=true)
 *   @returns {number} [originalLength] - Comprimento do texto original (apenas se success=true)
 *   @returns {number} [encryptedLength] - Comprimento do texto criptografado (apenas se success=true)
 *   @returns {string} [message] - Mensagem descritiva (apenas se success=false)
 *   @returns {string} [errorType] - Tipo do erro (apenas se success=false)
 */

export const encrypt = (text) => {
  try {
    if (!text) {
      return {
        success: false,
        message: 'Texto não fornecido para criptografia',
        errorType: ERROR_TYPES.VALIDATION,
      };
    }

    if (typeof text !== 'string') {
      return {
        success: false,
        message: 'Texto deve ser uma string',
        errorType: ERROR_TYPES.VALIDATION,
      };
    }

    if (text.length > MAX_PLAINTEXT_LENGTH) {
      return {
        success: false,
        message: `Texto deve ter no máximo ${MAX_PLAINTEXT_LENGTH} caracteres`,
        errorType: ERROR_TYPES.VALIDATION,
      };
    }

    if (text.length > MAX_PLAINTEXT_LENGTH) {
      return {
        success: false,
        message: `Texto deve ter no máximo ${MAX_PLAINTEXT_LENGTH} caracteres`,
        errorType: ERROR_TYPES.VALIDATION,
      };
    }

    const sanitizedText = text.trim().replace(/[^a-zA-Z0-9 ]/g, '');
    if (sanitizedText.length === 0) {
      return {
        success: false,
        message: 'Texto não pode conter apenas caracteres especiais',
        errorType: ERROR_TYPES.VALIDATION,
      };
    }

    const encrypted = encryptText(sanitizedText);
    logger.info('Texto criptografado com sucesso');

    return {
      success: true,
      encryptedText: encrypted,
      originalLength: text.length,
      encryptedLength: encrypted.length,
      timestamp: new Date().toISOString(),
      message: 'Criptografia realizada com sucesso',
    };
  } catch (error) {
    logger.error(`Erro ao criptografar texto: ${error.message}`);
    return {
      success: false,
      message: 'Erro ao criptografar texto',
      errorType: ERROR_TYPES.ENCRYPTION,
      errorDetails: process.env.NODE_ENV === 'development' ? error.message : undefined,
    };
  }
};

/**
 * Descriptografa um texto criptografado
 * @param {string} encryptedText - O texto criptografado a ser descriptografado
 * @returns {Object} - Resultado da operação de descriptografia
 *   @returns {boolean} success - Se a operação foi bem sucedida
 *   @returns {string} [decryptedText] - O texto descriptografado (apenas se success=true)
 *   @returns {number} [length] - Comprimento do texto descriptografado (apenas se success=true)
 *   @returns {string} [message] - Mensagem descritiva (apenas se success=false)
 *   @returns {string} [errorType] - Tipo do erro (apenas se success=false)
 */

export const decrypt = (encryptedText) => {
  try {
    if (!encryptedText) {
      return {
        success: false,
        message: 'Texto criptografado não fornecido para descriptografia',
        errorType: ERROR_TYPES.VALIDATION,
      };
    }

    if (typeof encryptedText !== 'string') {
      return {
        success: false,
        message: 'Texto criptografado deve ser uma string',
        errorType: ERROR_TYPES.VALIDATION,
      };
    }

    if (!encryptedText.includes(':') || encryptedText.split(':').length !== 2) {
      return {
        success: false,
        message: 'Formato de texto criptografado inválido',
        errorType: ERROR_TYPES.VALIDATION,
      };
    }

    const decrypted = decryptText(encryptedText);
    logger.info('Texto descriptografado com sucesso');

    return {
      success: true,
      decryptedText: decrypted,
      length: decrypted.length,
      timestamp: new Date().toISOString(),
      message: 'Descriptografia realizada com sucesso',
    };
  } catch (error) {
    logger.error(`Erro ao descriptografar texto: ${error.message}`);
    return {
      success: false,
      message: 'Erro ao descriptografar texto',
      errorType: ERROR_TYPES.DECRYPTION,
      errorDetails: process.env.NODE_ENV === 'development' ? error.message : undefined,
    };
  }
};
