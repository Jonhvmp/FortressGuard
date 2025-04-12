import request from 'supertest';
import app from '../../../src/app.js';

describe('Security Routes', () => {
  describe('GET /api/v1/generate-password', () => {
    test('retorna senha gerada com sucesso', async () => {
      const response = await request(app)
        .get('/api/v1/generate-password')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('password');
      expect(typeof response.body.data.password).toBe('string');
    });

    test('respeita parâmetros de comprimento', async () => {
      const length = 16;
      const response = await request(app)
        .get(`/api/v1/generate-password?length=${length}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.password.length).toBe(length);
    });

    test('rejeita parâmetros inválidos', async () => {
      await request(app)
        .get('/api/v1/generate-password?length=abc')
        .expect(400);
    });
  });

  describe('GET /api/v1/validate-password', () => {
    test('valida senha corretamente', async () => {
      const response = await request(app)
        .get('/api/v1/validate-password?password=StrongP@ss123')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('valid');
      expect(response.body.data).toHaveProperty('score');
      expect(typeof response.body.data.valid).toBe('boolean');
    });

    test('requer parâmetro de senha', async () => {
      await request(app)
        .get('/api/v1/validate-password')
        .expect(400);
    });
  });

  describe('GET /api/v1/encrypt-text', () => {
    test('criptografa um texto com sucesso', async () => {
      const response = await request(app)
        .get('/api/v1/encrypt-text?text=TesteSenhaSegura')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('encryptedText');
      expect(response.body.data).toHaveProperty('originalLength');
      expect(response.body.data).toHaveProperty('encryptedLength');
      expect(typeof response.body.data.encryptedText).toBe('string');
    });

    test('requer texto para criptografar', async () => {
      await request(app)
        .get('/api/v1/encrypt-text')
        .expect(400);
    });
  });

  describe('GET /api/v1/statistics', () => {
    test('retorna estatísticas com sucesso', async () => {
      const response = await request(app)
        .get('/api/v1/statistics')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('timestamp');
      expect(response.body.data).toHaveProperty('serverInfo');
    });
  });
});
