import { evaluatePasswordStrength, meetsMinimumRequirements } from "../../utils/passwordStrength.js";
import { generateRandomString, generateHash } from "../../utils/cryptoHelpers.js";
import logger from "../../utils/logger.js";

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

    const strength = evaluatePasswordStrength(password);

    logger.info(`Senha gerada com successo (comprimento: ${passwordLength}, caracteres especiais: ${includeSpecial})`);

    return {
      password,
      strength: strength.strength,
      score: strength.score,
    };
  } catch (error) {
    logger.error(`Erro ao gerar senha: ${error.message}`);
    throw new Error('Não foi possivel gerar uma senha segura');
  }
};

/**
 * Valida a força de uma senha fornecida
 * @param {string} password - A senha a ser avaliada.
 * @returns {Object} - Resultado da avaliação de segurança
 */

export const validatePassword = (password) => {
  try {
    if (!password) {
      return {
        valid: false,
        message: 'Senha não fornecida',
      };
    }

    const evaluation = evaluatePasswordStrength(password);
    const isValid = meetsMinimumRequirements(password);

    logger.info(`Senha validada: ${isValid ? 'aprovada' : 'reprovada'}`);

    return {
      valid: isValid,
      strength: evaluation.strength,
      score: evaluation.score,
      details: evaluation.details,
      feedback: evaluation.feedback,
    };
  } catch (error) {
    logger.error(`Erro na validação da senha: ${error.message}`);
    throw new Error('Não foi possivel validar a senha');
  }
};

/**
 * Gera um hash seguro para uma senha
 * @param {string} password - A senha a ser hashada.
 * @returns {string} - O hash gerado.
 */

export const hashPassword = (password) => {
  try {
    if (!password) {
      throw new Error('Senha não fornecida');
    }

    const hash = generateHash(password);

    logger.info('Hash gerado com successo');

    return hash;
  } catch (error) {
    logger.error(`Erro ao gerar hash: ${error.message}`);
    throw new Error('Não foi possivel gerar o hash da senha');
  }
}
