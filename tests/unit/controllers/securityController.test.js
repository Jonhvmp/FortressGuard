import { jest } from '@jest/globals';
import {
  generatePasswordController,
  validatePasswordController,
  encryptTextController,
  getStatisticasController
} from '../../../src/api/controllers/securityController.js';
import { HTTP_STATUS } from '../../../src/config/constants.js';

// Mock dos serviços
jest.mock('../../../src/api/services/passwordService.js', () => ({
  generatePassword: jest.fn().mockImplementation((length) => ({
    password: 'senha_segura_teste',
    strength: 'strong',
    score: 6
  })),
  validatePassword: jest.fn().mockImplementation((password) => ({
    valid: password && password !== 'fraca',
    strength: password === 'fraca' ? 'weak' : 'strong',
    score: password === 'fraca' ? 2 : 6,
    feedback: 'Feedback de teste'
  }))
}));

jest.mock('../../../src/api/services/encryptionService.js', () => ({
  encrypt: jest.fn().mockImplementation((text) => ({
    success: !!text,
    encryptedText: text ? 'texto_criptografado' : '',
    originalLength: text ? text.length : 0,
    encryptedLength: text ? 'texto_criptografado'.length : 0,
    error: text ? undefined : 'Texto inválido'
  }))
}));

jest.mock('../../../src/models/storage.js', () => ({
  recordPasswordGeneration: jest.fn(),
  recordPasswordValidation: jest.fn(),
  recordEncryption: jest.fn(),
  getStatistics: jest.fn().mockReturnValue({
    passwordsGenerated: 10,
    passwordsValidated: 5,
    textEncrypted: 3
  })
}));

jest.mock('../../../src/utils/logger.js', () => ({
  default: {
    info: jest.fn(),
    error: jest.fn()
  }
}));

// Mock para req e res
const mockRequest = (query = {}) => ({ query });
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('Security Controller', () => {
  describe('generatePasswordController', () => {
    test('gera senha com parâmetros padrão', () => {
      const req = mockRequest();
      const res = mockResponse();

      generatePasswordController(req, res);

      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        data: expect.objectContaining({
          password: expect.any(String)
        })
      }));
    });

    test('rejeita parâmetro length inválido', () => {
      const req = mockRequest({ length: 'abc' });
      const res = mockResponse();

      generatePasswordController(req, res);

      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
    });
  });

  describe('validatePasswordController', () => {
    test('valida senha corretamente', () => {
      const req = mockRequest({ password: 'senha_teste' });
      const res = mockResponse();

      validatePasswordController(req, res);

      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        data: expect.objectContaining({
          valid: true
        })
      }));
    });

    test('requer parâmetro de senha', () => {
      const req = mockRequest();
      const res = mockResponse();

      validatePasswordController(req, res);

      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
    });
  });

  describe('encryptTextController', () => {
    test('criptografa texto corretamente', () => {
      const req = mockRequest({ text: 'texto_para_criptografar' });
      const res = mockResponse();

      encryptTextController(req, res);

      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        data: expect.objectContaining({
          encryptedText: expect.any(String)
        })
      }));
    });

    test('requer texto para criptografar', () => {
      const req = mockRequest();
      const res = mockResponse();

      encryptTextController(req, res);

      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
    });
  });

  describe('getStatisticasController', () => {
    test('retorna estatísticas corretamente', () => {
      const req = mockRequest();
      const res = mockResponse();

      getStatisticasController(req, res);

      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        data: expect.objectContaining({
          timestamp: expect.any(String),
          serverInfo: expect.any(Object)
        })
      }));
    });
  });
});
