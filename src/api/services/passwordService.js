import { evaluatePasswordStrength, meetsMinimumRequirements } from "../../utils/passwordStrength";
import { generateRandomString, generateHash } from "../../utils/cryptoHelpers";
import logger from "../../utils/logger";

/**
 * Gera uma senha segura com base nos parâmetros especificos
 * @param {number} length - O comprimento da senha (default: 12).
 * @param {boolean} includeSpecial - Se deve incluir caracteres especiais (default: true).
 * @returns {Object} - Senha gerada e sua classificação de segurança.
 */

export const generatePassword = (length = 12, includeSpecial = true) => {
  try {
    const passwordLength = Math.min(Math.max(parseInt(length, 10) || 12, 6), 64);

    const password = generateRandomString(passwordLength, includeSpecial);

    const streagth = evaluatePasswordStrength(password);

    logger.info(`Senha gerada com sucesso (comprimento: ${passwordLength}, caracteres especiais: ${includeSpecial})`);

    return {
      password,
      streagth: streagth.streagth,
      score: streagth.score,
    };
  } catch (error) {
    logger.error(`Erro ao gerar senha: ${error.message}`);
    throw new Error('Não foi possivel gerar uma senha segura');
  }
};
