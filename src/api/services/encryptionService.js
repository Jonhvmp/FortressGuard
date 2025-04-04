import { encryptText, decryptText } from "../../utils/cryptoHelpers.js";
import logger from "../../utils/logger.js";

/**
 * Criptografa um texto fornecido
 * @param {string} text - O texto a ser criptografado
 * @returns {Object} - Resultado da operação de criptografia
 */

export const encrypt = (text) => {
  try {
    if (!text) {
      return {
        sucess: false,
        message: 'Texto não forncecido para criptografia',
      };
    }

    const encrypted = encryptText(text);
    logger.info('Texto criptografado com sucesso');

    return {
      sucess: true,
      encryptedText: encrypted,
      originalLength: text.length,
      encryptedLength: encrypted.length,
    };
  } catch (error) {
    logger.error(`Erro ao criptografar texto: ${error.message}`);
    return {
      sucess: false,
      message: 'Erro ao criptografar texto',
      error: error.message,
    };
  }
};

/**
 * Descriptografa um texto criptografado
 * @param {string} encryptedText - O texto criptografado a ser descriptografado
 * @returns {Object} - Resultado da operação de descriptografia
 */

export const decrypt = (encryptedText) => {
  try {
    if (!encryptedText) {
      return {
        sucess: false,
        message: 'Texto criptografado não fornecido',
      };
    }

    const decrypted = decryptText(encryptedText);
    logger.info('Texto descriptografado com sucesso');

    return {
      sucess: true,
      decryptedText: decrypted,
      length: decrypted.length,
    };
  } catch (error) {
    logger.error(`Erro ao descriptografar texto: ${error.message}`);
    return {
      sucess: false,
      message: 'Erro ao descriptografar texto',
      error: error.message,
    };
  }
};
