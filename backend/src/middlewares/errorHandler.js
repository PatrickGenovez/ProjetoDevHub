const ApiResponse = require('../utils/apiResponse');
const { CONFIG, HTTP_STATUS } = require('../config/constants');

/**
 * Middleware global de captura e tratamento de exceções (Clean Code)
 */
function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  const message = err.message || 'Ocorreu um erro interno no servidor.';

  console.error(`[Error Handler] ${req.method} ${req.url} - Status ${statusCode}:`, err);

  const details = CONFIG.NODE_ENV === 'development' ? err.stack : undefined;

  return ApiResponse.error(res, message, statusCode, details);
}

/**
 * Middleware para capturar rotas não encontradas (404)
 */
function notFoundHandler(req, res, next) {
  return ApiResponse.notFound(res, `Rota '${req.method} ${req.originalUrl}' não encontrada.`);
}

module.exports = {
  errorHandler,
  notFoundHandler
};
