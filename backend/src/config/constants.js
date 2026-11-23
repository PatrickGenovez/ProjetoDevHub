require('dotenv').config();

/**
 * Constantes e configurações centralizadas do backend (Clean Code / Single Source of Truth)
 */
const CONFIG = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  JWT_SECRET: process.env.JWT_SECRET || 'bibliotech_super_secret_jwt_key_2025',
  JWT_EXPIRES_IN: '7d',
  BCRYPT_SALT_ROUNDS: 10,
  DEFAULT_PAGE_SIZE: 12,
  MAX_PAGE_SIZE: 50,
  MASTER_DB_NAME: process.env.DB_MASTER_NAME || process.env.DB_NAME || 'bibliotech_master'
};

const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
};

const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  VISITOR: 'visitante'
};

const PLANS = {
  VISITOR: 'visitante',
  VIP: 'vip',
  // Legados para retrocompatibilidade
  DIGITAL: 'vip',
  BOX_VIP: 'vip',
  MASTER: 'vip'
};

module.exports = {
  CONFIG,
  HTTP_STATUS,
  USER_ROLES,
  PLANS
};
