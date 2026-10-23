const jwt = require('jsonwebtoken');
const { CONFIG } = require('../config/constants');
const ApiResponse = require('../utils/apiResponse');

/**
 * Middleware para verificação e validação de Token JWT (Clean Code)
 */
function verifyToken(req, res, next) {
  const authHeader = req.header('Authorization') || req.headers['authorization'];

  if (!authHeader) {
    return ApiResponse.unauthorized(res, 'Acesso negado! Token de autenticação não informado.');
  }

  const token = authHeader.startsWith('Bearer ')
    ? authHeader.slice(7).trim()
    : authHeader.trim();

  if (!token) {
    return ApiResponse.unauthorized(res, 'Formato de token inválido.');
  }

  try {
    const verified = jwt.verify(token, CONFIG.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    return ApiResponse.unauthorized(res, 'Token inválido ou expirado! Faça login novamente.');
  }
}

module.exports = verifyToken;
