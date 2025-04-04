import logger from "../utils/logger";

// Armazenamento em memória para stats e histórico
const inMemoryStorage = {
  stats: {
    passwordsdGenerated: 0,
    passwordsValidated: 0,
    textEncrypted: 0,
    stregthDistribution: {
      weak: 0,
      medium: 0,
      strong: 0,
      very_strong: 0,
    },
  },
// Armazena os útimos 100 eventos (sem senhas/textos reais por segurança)
  history: [],
};


/**
 * Registra uma nova geração de senha nas estatísticas
 * @param {string} strength - Força da senha gerada
 */
export const recordPasswordGeneration = (strength) => {
  try {
    inMemoryStorage.stats.passwordsdGenerated += 1;
    inMemoryStorage.stats.stregthDistribution[strength] += 1;

    // add ao historico
    addToHistory('generate_password', { strength });

    logger.debug('Estatísticas de geração de senha atualizadas com sucesso');
  } catch (error) {
    logger.error(`Erro ao registrar geração de senha: ${error.message}`);
  }
};

/**
 * Registra uma validação de senha nas estatísticas
 * @param {string} strength - Força da senha validada
 * @param {boolean} valid - Se a senha atente aos requisitos mínimos
 */

export const recordPasswordValidation = (strength, valid) => {
  try {
    inMemoryStorage.stats.passwordsValidated += 1;

    // add ao historico
    addToHistory('validate_password', { strength, valid });

    logger.debug('Estatísticas de validação de senha atualizadas com sucesso');
  } catch (error) {
    logger.error(`Erro ao registrar validação de senha: ${error.message}`);
  }
};

/**
 * Registra uma operação de criptografia
 * @param {boolean} sucess - Se a operação foi bem-sucedida
 */

export const recordEncryption = (sucess) => {
  try {
    if (sucess) {
      inMemoryStorage.stats.textEncrypted += 1;
    }

    // add ao historico
    addToHistory('encrypt_text', { sucess });

    logger.debug('Estatísticas de criptografia atualizadas com sucesso');
  } catch (error) {
    logger.error(`Erro ao registrar estatísticas de criptografia: ${error.message}`);
  }
};

/**
 * Adiciona uma entrada ao histórico
 * @param {string} action - Ação realizada
 * @param {Object} details - Detalhes da ação (sem dados sensíveis)
 */

const addToHisory = (action, details) => {
  try {
    const event = {
      timestamp: new Date().toISOString(),
      action,
      details,
    };

    // limita o historico a 100 itens
    inMemoryStorage.histor.unshift(event);
    if (inMemoryStorage.history.length > 100) {
      inMemoryStorage.history.pop();
    }
  } catch (error) {
    logger.error(`Erro ao adicionar ao histórico: ${error.message}`);
  }
};
