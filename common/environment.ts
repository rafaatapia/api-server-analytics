export const environment = {
  server: { port: process.env.SERVER_PORT || 3000 },
  db: { url: process.env.DB_URL || "mongodb://localhost/bmake" },
  security: {
    saltRounds: process.env.SALT_ROUNDS || 999999,
    apiSecret: process.env.API_SECRET || 'bmake-secret',
    enableHTTPS: process.env.ENABLE_HTTPS || false,
    certificate: process.env.CERTI_FILE || './security/keys/cert.pem',
    key: process.env.CERTI_FILE_KEY || './security/keys/cert.pem'
  },
  log: {
    name: 'bmake-api-logger',
    level: process.env.LOG_LEVEL || 'debug'
  }
}
