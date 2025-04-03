import { encryptText, decryptText } from "../../utils/cryptoHelpers";
import logger from "../../utils/logger";

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
