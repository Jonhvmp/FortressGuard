import express from "express";
import { encryptTextController, generatePasswordController, getStatisticasController, validatePasswordController } from "../controllers/securityController.js";

const router = express.Router();

/**
 * @route GET /api/generate-password
 * @desc Gera uma senha segura
 * @access Public
 * @query {number} length - Comprimento da senha (opcional, padrão: true)
 * @query {boolean} special - Se deve incluir caracteres especiais (opcional, padrão: true)
 * @returns {Object} - Senha gerada e sua classificação de segurança
 */
router.get("/generate-password", generatePasswordController);


/**
 * @route GET /api/validate-password
 * @desc Valida a força de uma senha
 * @access Public
 * @query {string} password - A senha a ser validada
 * @returns {Object} - Resultado da validação de segurança
 */
router.get("/validate-password", validatePasswordController);

/**
 * @route GET /api/encrypt-text
 * @desc Criptografa um texto
 * @access Public
 * @query {string} text - O texto a ser criptografado
 * @returns {Object} - Texto criptografado
 */
router.get("/encrypt-text", encryptTextController);

/**
 * @route GET /api/statistics
 * @des Retorna estatísticas de uso da API
 * @access Public
 * @returns {Object} - Estatísticas coletadas
 */
router.get("/statistics", getStatisticasController);

export default router;

