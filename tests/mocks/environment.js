export default {
  port: 3000,
  nodeEnv: 'test',
  apiVersion: 'v1',
  jwtSecret: 'test-secret',
  encryptionKey: 'test-encryption-key',
  rateLimit: {
    windowMs: 900000,
    max: 100,
  },
  logLevel: 'info',
  isProd: false,
  isTest: true,
};
