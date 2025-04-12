import express from "express";
import { encryptTextController, generatePasswordController, getStatisticasController, validatePasswordController } from "../controllers/securityController.js";
import rateLimiterMiddleware from "../../utils/rateLimiter.js";

const router = express.Router();

/**
 * @route GET /api/generate-password
 * @desc Gera uma senha segura
 * @access Public
 * @query {number} length - Comprimento da senha (opcional, padrão: true)
 * @query {boolean} special - Se deve incluir caracteres especiais (opcional, padrão: true)
 * @returns {Object} - Senha gerada e sua classificação de segurança
 */
router.get("/generate-password", rateLimiterMiddleware, generatePasswordController);
/**
 * Exemplos de uso:
 * GET /api/generate-password?length=12&special=true
 * GET /api/generate-password?length=16&special=false
 * GET /api/generate-password?length=8
 * GET /api/generate-password?special=false
 * GET /api/generate-password
 */


/**
 * @route GET /api/validate-password
 * @desc Valida a força de uma senha
 * @access Public
 * @query {string} password - A senha a ser validada
 * @returns {Object} - Resultado da validação de segurança
 */
router.get("/validate-password", rateLimiterMiddleware, validatePasswordController);

/**
 * @route GET /api/encrypt-text
 * @desc Criptografa um texto
 * @access Public
 * @query {string} text - O texto a ser criptografado
 * @returns {Object} - Texto criptografado
 */
router.get("/encrypt-text", rateLimiterMiddleware, encryptTextController);

/**
 * @route GET /api/statistics
 * @desc Retorna estatísticas de uso da API
 * @access Public
 * @returns {Object} - Estatísticas coletadas
 */
router.get("/statistics", rateLimiterMiddleware, getStatisticasController);

export default router;

