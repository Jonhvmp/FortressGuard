import express from "express";
import { generatePasswordController } from "../controllers/securityController";

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
