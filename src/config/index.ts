import dotenv from 'dotenv';
const path = require('path')

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

let envFilePath = path.relative(__dirname, ".env")
// for package json 
const packageEnvFound = dotenv.config({ path: envFilePath });
const envFound = dotenv.config();

if (envFound.error && packageEnvFound.error) {
  // This error should crash whole process

  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

export default {
  /**
   * Your favorite port
   */
  port: process.env.PORT,


  /**
   * Your secret sauce
   */
  jwtSecret: process.env.JWT_SECRET,
  jwtAlgorithm: process.env.JWT_ALGO,
  jwtExpiresIn: process.env.JWT_EXPIRES,

  /**
   * Used by winston logger
   */
  logs: {
    level: process.env.LOG_LEVEL || 'silly',
  },

  /**
   * API configs
   */
  api: {
    prefix: '/api',
  },
  https: {
    port: process.env.HTTPS_PORT || 8443,
    tls: { certificate: 'cert.pem', key: 'key.pem', path: 'tls/' },
  },
  /**
   * Mailgun email credentials
   */
  emails: {
    from: process.env.EMAIL_FROM,
    host: process.env.EMAIL_HOST,
    username: process.env.EMAIL_USERNAME,
    password: process.env.EMAIL_PASSWORD,
    smtpPort: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE,
    apiKey: process.env.MAILGUN_API_KEY,
    apiUsername: process.env.MAILGUN_USERNAME,
    domain: process.env.MAILGUN_DOMAIN,
    cc: process.env.EMAIL_CC,
  },
  secret: {
    privateKeySecret: process.env.PRIVATE_KEY_SECRET || 'dextiny',
    passwordSecret: process.env.PASSWORD_SECRET
  }
};
