import express from "express";
import { generatePasswordController, validatePasswordController } from "../controllers/securityController";

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
