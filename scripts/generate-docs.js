/* eslint-disable max-len */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import YAML from 'yamljs';
import environment from '../src/config/environment.js';
import logger from '../src/utils/logger.js';

// Configuração de caminhos
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputDir = path.join(__dirname, '../docs/api');

// Criar diretório de saída se não existir
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
  logger.info(`Diretório de documentação criado: ${outputDir}`);
}

// Definição do documento OpenAPI
const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'FortressGuard API',
    version: environment.apiVersion,
    description: 'API de Segurança Digital para geração e validação de senhas seguras e criptografia de texto',
    contact: {
      name: 'Jonhvmp',
      url: 'https://github.com/Jonhvmp/fortressguard',
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT',
    },
  },
  servers: [
    {
      url: `http://localhost:${environment.port}/api/${environment.apiVersion}`,
      description: 'Servidor local de desenvolvimento',
    },
    {
      url: `https://fortressguard.orrender.app/api/${environment.apiVersion}`,
      description: 'Servidor de produção',
    },
  ],
  tags: [
    {
      name: 'Passwords',
      description: 'Operações relacionadas à geração e validação de senhas',
    },
    {
      name: 'Encryption',
      description: 'Operações relacionadas à criptografia e segurança',
    },
    {
      name: 'Statistics',
      description: 'Estatísticas e métricas da API',
    },
  ],
  paths: {
    '/generate-password': {
      get: {
        tags: ['Passwords'],
        summary: 'Gera uma senha segura',
        description: 'Gera uma senha segura com base nos parâmetros fornecidos',
        parameters: [
          {
            name: 'length',
            in: 'query',
            schema: { type: 'integer', default: 12 },
            description: 'Comprimento da senha a ser gerada',
            required: false,
          },
          {
            name: 'special',
            in: 'query',
            schema: { type: 'boolean', default: true },
            description: 'Se deve incluir caracteres especiais na senha',
            required: false,
          },
        ],
        responses: {
          200: {
            description: 'Senha gerada com sucesso',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'object',
                      properties: {
                        password: { type: 'string', example: 'P@ssw0rd!2023' },
                        strength: { type: 'string', example: 'strong' },
                        score: { type: 'integer', example: 6 },
                        timestamp: { type: 'string', format: 'date-time' },
                      },
                    },
                  },
                },
              },
            },
          },
          400: { description: 'Parâmetros inválidos' },
          429: { description: 'Limite de requisições excedido' },
          500: { description: 'Erro interno do servidor' },
        },
      },
    },
    '/validate-password': {
      get: {
        tags: ['Passwords'],
        summary: 'Valida a força de uma senha',
        parameters: [
          {
            name: 'password',
            in: 'query',
            schema: { type: 'string' },
            description: 'Senha a ser validada',
            required: true,
          },
        ],
        responses: {
          200: {
            description: 'Resultado da validação da senha',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'object',
                      properties: {
                        valid: { type: 'boolean', example: true },
                        strength: { type: 'string', example: 'strong' },
                        score: { type: 'integer', example: 6 },
                        feedback: { type: 'string', example: 'A senha é forte. Boa escolha!' },
                      },
                    },
                  },
                },
              },
            },
          },
          400: { description: 'Parâmetros inválidos' },
          429: { description: 'Limite de requisições excedido' },
          500: { description: 'Erro interno do servidor' },
        },
      },
    },
    '/encrypt-text': {
      get: {
        tags: ['Encryption'],
        summary: 'Criptografa um texto fornecido',
        parameters: [
          {
            name: 'text',
            in: 'query',
            schema: { type: 'string' },
            description: 'Texto a ser criptografado',
            required: true,
          },
        ],
        responses: {
          200: {
            description: 'Texto criptografado com sucesso',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'object',
                      properties: {
                        encryptedText: { type: 'string', example: 'iv-12345:AABCDEF123456789' },
                        originalLength: { type: 'integer', example: 12 },
                        encryptedLength: { type: 'integer', example: 32 },
                        timestamp: { type: 'string', format: 'date-time' },
                      },
                    },
                  },
                },
              },
            },
          },
          400: { description: 'Parâmetros inválidos' },
          429: { description: 'Limite de requisições excedido' },
          500: { description: 'Erro interno do servidor' },
        },
      },
    },
    '/statistics': {
      get: {
        tags: ['Statistics'],
        summary: 'Retorna estatísticas de uso da API',
        responses: {
          200: {
            description: 'Estatísticas recuperadas com sucesso',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'object',
                      properties: {
                        passwordsGenerated: { type: 'integer', example: 152 },
                        passwordsValidated: { type: 'integer', example: 89 },
                        textEncrypted: { type: 'integer', example: 43 },
                        timestamp: { type: 'string', format: 'date-time' },
                        serverInfo: { type: 'object' },
                      },
                    },
                  },
                },
              },
            },
          },
          429: { description: 'Limite de requisições excedido' },
          500: { description: 'Erro interno do servidor' },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      ApiKeyAuth: {
        type: 'apiKey',
        in: 'header',
        name: 'X-API-Key',
      },
    },
  },
};

// Gerar arquivos de documentação
try {
  // Gerar JSON
  const jsonOutput = path.join(outputDir, 'swagger.json');
  fs.writeFileSync(jsonOutput, JSON.stringify(swaggerDocument, null, 2));
  logger.info(`Documentação JSON gerada em: ${jsonOutput}`);

  // Gerar YAML
  const yamlOutput = path.join(outputDir, 'swagger.yaml');
  fs.writeFileSync(yamlOutput, YAML.stringify(swaggerDocument, 6));
  logger.info(`Documentação YAML gerada em: ${yamlOutput}`);

  // Criar arquivo HTML com redirecionamento para Swagger UI
  const htmlContent = `
<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="refresh" content="0;url=/api/${environment.apiVersion}/docs">
  <title>FortressGuard API - Documentação</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      color: #333;
    }
    h1 { color: #2c3e50; }
    a { color: #3498db; text-decoration: none; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <h1>FortressGuard API - Documentação</h1>
  <p>Redirecionando para documentação Swagger UI...</p>
  <p>Se você não for redirecionado automaticamente, <a href="/api/${environment.apiVersion}/docs">clique aqui</a>.</p>
</body>
</html>`;

  const htmlOutput = path.join(outputDir, 'index.html');
  fs.writeFileSync(htmlOutput, htmlContent);
  logger.info(`Página HTML de redirecionamento gerada em: ${htmlOutput}`);

  logger.info('Geração de documentação concluída com sucesso!');
} catch (error) {
  logger.error(`Erro ao gerar documentação: ${error.message}`);
  process.exit(1);
}
