import { PASSWORD_STRENGTH, PASSWORD_CRITERIA } from '../config/constants.js';
import logger from './logger.js';

/**
 * Verifica a força de uma senha com base em diversos critérios.
 * @param {string} password - A senha a ser verificada.
 * @return {Object} - O obj contendo a class da senha e detalhes da analise.
 */

export const evaluatePasswordStrength = (password) => {
  try {
    if (!password || typeof password !== 'string') {
      return {
        strength: PASSWORD_STRENGTH.WEAK,
        score: 0,
        feedback: 'A senha não pode ser vazia'
      };
    }

    const hasLength = password.length >= PASSWORD_CRITERIA.MIN_LENGTH;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSpecialChars = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);

    let score = 0;
    if (hasLength) score += 1;
    if (hasUppercase) score += 1;
    if (hasLowercase) score += 1;
    if (hasNumbers) score += 1;
    if (hasSpecialChars) score += 1;
    if (password.length >= PASSWORD_CRITERIA.RECOMMENDED_LENGTH) score += 1;

    let strength;
    let feedback = [];

    if (score <= 2) {
      strength = PASSWORD_STRENGTH.WEAK;
      feedback.push('A senha é fraca. Considere adicionar mais caracteres e variedade.');
    } else if (score <= 4) {
      strength = PASSWORD_STRENGTH.MEDIUM;
      feedback.push('A senha é média. Considere adicionar mais variedade.');
    } else {
      strength = PASSWORD_STRENGTH.STRONG;
      feedback.push('A senha é forte. Boa escolha!');
    }

    if (!hasLength) feedback.push(`A senha deve ter pelo menos ${PASSWORD_CRITERIA.MIN_LENGTH} caracteres.`);
    if (!hasUppercase) feedback.push('Adicione letras maiúsculas para aumentar a segurança.');
    if (!hasLowercase) feedback.push('Adicione letras minúsculas para aumentar a segurança.');
    if (!hasNumbers) feedback.push('Adicione números para aumentar a segurança.');
    if (!hasSpecialChars) feedback.push('Adicione caracteres especiais para aumentar a segurança.');

    return {
      strength,
      score,
      details: {
        hasLength,
        hasUppercase,
        hasLowercase,
        hasNumbers,
        hasSpecialChars,
        length: password.length,
      },
      feedback: feedback.join(' ')
    };
  } catch (error) {
    logger.error(`Erro na avaliação da senha: ${error.message}`)
    return {
      strength: PASSWORD_STRENGTH.WEAK,
      score: 0,
      feedback: 'Não foi possível avaliar a senha'
    };
  }
};

/**
 * Verifica se uma atende aos requisitos mínimos de segurança.
 * @param {string} password - A senha a ser verificada.
 * @return {boolean} - Verdadeiro se a senha atende aos requisitos, falso caso contrário.
 */

export const meetsMinimumRequirements = (password) => {
  const evaluation = evaluatePasswordStrength(password);
  return evaluation.score >= 3; // média ou melhor
};

/**
 * Gera dicas para melhorar a seguranã de uma senha.
 * @param {string} password - A senha a receber sugestões.
 * @returns {Array<string>} - Lista de sugestões de melhoria
 */

export const getPasswordImprovement = (password) => {
  const evaluation = evaluatePasswordStrength(password);

  return evaluation.feedback
    .split('.')
    .filter(item =>
      item.includes('Adicione') ||
      item.includes('Deve ter')
    )
    .map(item => item.trim())
    .filter(item => item.length > 0);
}
