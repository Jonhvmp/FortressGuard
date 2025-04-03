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
