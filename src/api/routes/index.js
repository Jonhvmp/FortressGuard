import express from "express";
import securityRoutes from "./securityRoutes.js";
import environment from "../../config/environment.js";
import { HTTP_STATUS } from "../../config/constants.js";

const router = express.Router();

router.get('/', (req, res) => {
  res.status(HTTP_STATUS.OK).json({
    name: 'FortressGuard API',
    version: environment.apiVersion,
    description: 'API de segurança digital para proteção de dados e senhas',
    author: 'Jonh Alex',
    timestamp: new Date().toISOString(),
    endpoints: {
      generatePassword: `/api/${environment.apiVersion}/generate-password`,
      validatePassword: `/api/${environment.apiVersion}/validate-password`,
      encryptText: `/api/${environment.apiVersion}/encrypt-text`,
      statistics: `/api/${environment.apiVersion}/statistics`,
    },
    documentation: `/docs`,
  });
});

// rotas de segurança
router.use('/', securityRoutes);

export default router;
