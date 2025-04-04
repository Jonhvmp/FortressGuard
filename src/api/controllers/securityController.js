

/**
 * Gera uma senha segura com base nos parâmetros da requisição.
 * @param {Object} req - O objeto de requisição.
 * @param {Object} res - O objeto de resposta.
 */

import { HTTP_STATUS } from "../../config/constants";
import { recordPasswordGeneration } from "../../models/storage";
import logger from "../../utils/logger";
import { generatePassword } from "../services/passwordService";

export const generatePasswordController = (req, res) => {
  try {
    // extrair parâmetros da query
    const length = parseInt(req.query.length, 10) || 12;
    const includeSpecial = req.query.special !== 'false'; // padrão é true

    // chamar serviço p gerar senha
    const result = generatePassword(length, includeSpecial);

    // registrar stats
    recordPasswordGeneration(result.strength);

    logger.info(`Senha gerada (comprimento: ${length}, especiais: ${includeSpecial})`);

    res.status(HTTP_STATUS.OK).json({
      sucess: true,
      data: {
        password: result.password,
        strength: result.strength,
        score: result.score,
        timestamp: new Date().toISOString(),
        params: {
          length,
          includeSpecial,
        },
      }
    });
  } catch (error) {
    logger.error(`Erro ao gerar senha: ${error.message}`);

    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      sucess: false,
      message: 'Erro ao gerar senha',
      error: error.message,
    });
  }
};
