import { HTTP_STATUS } from "../../config/constants.js";
import { getStatistics, recordEncryption, recordPasswordGeneration, recordPasswordValidation } from "../../models/storage.js";
import logger from "../../utils/logger.js";
import { generatePassword, validatePassword } from "../services/passwordService.js";
import { encrypt } from "../services/encryptionService.js";
// import { error } from "winston";

/**
 * Gera uma senha segura com base nos parâmetros da requisição.
 * @param {Object} req - O objeto de requisição.
 * @param {Object} res - O objeto de resposta.
 */

export const generatePasswordController = (req, res) => {
  try {

    const MIN_LENGTH = 8;
    const MAX_LENGTH = 32;

    const allowedParams = ['length', 'special'];
    const receivedParams = Object.keys(req.query);


    const invalidParams = receivedParams.filter(param =>
      !allowedParams.includes(param) && param !== ''
    );

    if (invalidParams.length > 0) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: 'Parâmetros inválidos',
        message: 'Os seguintes parâmetros são inválidos: ' + invalidParams.join(', '),
        allowedParams: allowedParams,
      });
    }

    let length;

    if (req.query.length) {
      if (!/^\d+$/.test(req.query.length)) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          error: 'Parâmetro inválido',
          message: 'O parâmetro "length" deve ser um número inteiro positivo',
        });
      }

      length = parseInt(req.query.length, 10) || 12;
    } else {
      length = 12; // default
    }

    if (length < MIN_LENGTH || length > MAX_LENGTH) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: 'Parâmetro inválido',
        message: `O comprimento da senha deve ser entre ${MIN_LENGTH} e ${MAX_LENGTH} caracteres`,
      });
    }

    if (req.query.special !== undefined && req.query.special !== 'true' && req.query.special !== 'false') {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: 'Formato inválido',
        message: 'O parâmetro "special" deve ser "true" ou "false"',
      });
    }

    const includeSpecial = req.query.special !== 'false'; // padrão é true

    // chamar serviço p gerar senha
    const result = generatePassword(length, includeSpecial);

    // registrar stats
    recordPasswordGeneration(result.strength);

    logger.info(`Senha gerada (comprimento: ${length}, especiais: ${includeSpecial})`);

    res.status(HTTP_STATUS.OK).json({
      success: true,
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
      success: false,
      message: 'Erro ao gerar senha',
      // error: error.message,
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
        success: false,
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
      success: true,
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
      success: false,
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
        success: false,
        error: 'Parâmetro obrigatório ausente',
        message: 'O parâmetro "text" é obrigatório',
      });
    }

    // chamar serviço p criptografar texto
    const result = encrypt(text);

    recordEncryption(result.success);

    logger.info(`Texto criptografado com successo`);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: {
        encryptedText: result.encryptedText,
        originalLength: result.originalLength,
        encryptedLength: result.encryptedLength,
        timestamp: new Date().toISOString(),
      }
    });
    console.log(`Texto criptografado: ${result.encryptedText}`);
  } catch (error) {
    logger.error(`Erro ao criptografar texto: ${error.message}`);

    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
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

    logger.info(`Estatísticas recuperadas com successo`);

    res.status(HTTP_STATUS.OK).json({
      success: true,
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
      success: false,
      message: 'Erro ao recuperar estatísticas',
      error: error.message,
    });
  }
};
