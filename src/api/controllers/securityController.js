import { HTTP_STATUS } from "../../config/constants";
import { getStatistics, recordEncryption, recordPasswordGeneration } from "../../models/storage";
import logger from "../../utils/logger";
import { generatePassword, validatePassword } from "../services/passwordService";

/**
 * Gera uma senha segura com base nos parâmetros da requisição.
 * @param {Object} req - O objeto de requisição.
 * @param {Object} res - O objeto de resposta.
 */

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

/**
 * Valida a força de uma senha
 * @param {Object} req - O objeto de requisição Express
 * @param {Object} res - O objeto de resposta Express
 */

export const validatePasswordController = (req, res) => {
  try {
    const { password } = req.query;

    if (!password) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        sucess: false,
        error: 'Parâmetro obrigatório ausente',
        message: 'O parâmetro "password" é obrigatório',
      });
    }

    // chamar serviço p validar senha
    const result = validatePassword(password);

    // registrar stats
    recordPasswordValidation(result.strength, result.valid);

    logger.info(`Senha validada: ${result.valid ? 'aprovada' : 'reprovada'}`);

    res.status(HTTP_STATUS.OK).json({
      sucess: true,
      data: {
        valid: result.valid,
        strength: result.strength,
        score: result.score,
        feedback: result.feedback,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    logger.error(`Erro ao validar senha: ${error.message}`);

    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      sucess: false,
      message: 'Falha ao validar senha',
      error: error.message,
    });
  }
};

/**
 * Criptografa um texto fornecido
 * @param {Object} req - O objeto de requisição Express
 * @param {Object} res - O objeto de resposta Express
 */

export const encryptTextController = (req, res) => {
  try {
    const { text } = req.query;

    if (!text) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        sucess: false,
        error: 'Parâmetro obrigatório ausente',
        message: 'O parâmetro "text" é obrigatório',
      });
    }

    // chamar serviço p criptografar texto
    const result = encrypt(text);

    recordEncryption(result.sucess);

    logger.info(`Texto criptografado com sucesso`);

    res.status(HTTP_STATUS.OK).json({
      sucess: true,
      data: {
        encryptedText: result.encryptedText,
        originalLength: result.originalLength,
        encryptedLength: result.encryptedLength,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    logger.error(`Erro ao criptografar texto: ${error.message}`);

    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      sucess: false,
      message: 'Erro ao criptografar texto',
      error: error.message,
    });
  }
};

/**
 * Retorna stats de uso da API
 * @param {Object} req - O objeto de requisição Express
 * @param {Object} res - O objeto de resposta Express
 */

export const getStatisticasController = (req, res) => {
  try {
    const stats = getStatistics();

    logger.info(`Estatísticas recuperadas com sucesso`);

    res.status(HTTP_STATUS.OK).json({
      sucess: true,
      data: {
        ...stats,
        timestamp: new Date().toISOString(),
        serverInfo: {
          uptime: process.uptime(),
          memoryUsage: process.memoryUsage(),
          nodeVersion: process.version,
        },
      },
    });
  } catch (error) {
    logger.error(`Erro ao recuperar estatísticas: ${error.message}`);

    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      sucess: false,
      message: 'Erro ao recuperar estatísticas',
      error: error.message,
    });
  }
};
