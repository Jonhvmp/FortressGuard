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
 * @param {string} streagth - Força da senha gerada
 */
export const recordPasswordGeneration = (streagth) => {
  try {
    inMemoryStorage.stats.passwordsdGenerated += 1;
    inMemoryStorage.stats.stregthDistribution[streagth] += 1;

    // add ao historico
    addToHistory('generate_password', { streagth });

    logger.debug('Estatísticas de geração de senha atualizadas com sucesso');
  } catch (error) {
    logger.error(`Erro ao registrar geração de senha: ${error.message}`);
  }
};
